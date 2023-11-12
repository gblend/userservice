import {ITokenUser, IUser} from '../interface';
import {UserService} from './userService';
import {BadRequestError, CustomAPIError, UnauthenticatedError} from '../lib/errors';
import {formatValidationError, generateToken, sendVerificationEmail, useCallback, userValidator} from '../lib/utils';
import {config} from '../config/config';
import {pushToQueue} from '../lib/utils/amqplib';
import {TokenService} from './tokenService';
import Role from '../models/Role';

export class AuthService{
    private userService: UserService;
    private tokenService: TokenService;

    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
    }
    async register(body: IUser, ip: string, headers: any): Promise<any> {

        const { email, firstname, lastname, password, roleId }: IUser = body;
        const { error } = userValidator.validateCreateUserDto(body);
        if (error) {
            throw new BadRequestError(formatValidationError(error).toLocaleString())
        }

        const isEmailExist = await this.userService.findOne({where: {email}});
        if (isEmailExist) {
          throw new CustomAPIError('This email address is already in use');
        }

        const verificationToken: string = generateToken();
        const user: any = await this.userService.create({
          email: email!,
          firstname: firstname!,
          lastname: lastname!,
          password: password!,
          roleId: roleId!,
          verificationToken
        });

        const accessToken: string = await this.userService.createJWT(user);

        // send account verification email via queue
        const queueErrorMsg: string = 'Unable to queue verify email, please try again';
        const queueName: string = config.amqp.verifyEmailQueue;
        const verificationEmailPayload = {
          name: user.firstname,
          email: user.email,
          verificationToken: user.verificationToken,
        };
        await pushToQueue(queueName, queueErrorMsg, verificationEmailPayload).catch(
            (_: Error) => useCallback(sendVerificationEmail, verificationEmailPayload),
        );
        user.password = undefined;

        const tokenInfo = await this.tokenService.saveInfo(user, ip, headers);
        const refreshToken: string = await this.userService.createRefreshJWT(
            user,
            tokenInfo.refreshToken,
        );

        return {accessToken, refreshToken, user}
    }

    async logout(user: ITokenUser): Promise<void> {
        await this.tokenService.destroy({where: {userId: user.id}});
    }

    async login(body: {email: string, password: string}, ip: string, headers: any): Promise<any> {
        const { email, password } = body;
        let verificationMsg: string = '';

        const { error } = userValidator.validateLoginDto(body);
        if (error) {
            throw new BadRequestError(formatValidationError(error).toLocaleString());
        }

        const user: any = await this.userService.findOne({where: {email}, include: [{model: Role, attributes: ['id', 'name']}]});
        if (!user) {
            throw new BadRequestError('Invalid credentials');
        }

        const isMatch: boolean = await this.userService.comparePassword(password, user);

        if (!isMatch) {
            throw new BadRequestError('Invalid email or password.');
        }

        if (!user.isVerified) {
            verificationMsg =
                'Please verify your email to get full access to your account capabilities.';
        } else verificationMsg = 'Verified';

        const accessToken: string = await this.userService.createJWT(user);
        const tokenInfo = await this.tokenService.saveInfo(user, ip, headers);
        const refreshToken: string = await this.userService.createRefreshJWT(
            user,
            tokenInfo.refreshToken,
        );

        user.password = undefined;
        user.deletedAt = undefined;
        user.verificationToken = undefined;

        return {
            user,
            accessToken,
            refreshToken,
            verificationMsg
        }
    }

   async  verifyEmail({email, token}: {email: string, token: string}): Promise<any> {
       const { error } = userValidator.validateVerifyUserDto({email, token});
       if (error) {
           throw new BadRequestError(formatValidationError(error).toLocaleString());
       }

       const user = await this.userService.findOne({where: {email}});
       if (!user) {
         throw new UnauthenticatedError(
             'Account verification failed, account not found',
         );
       }

       if (user.isVerified) return true;

       if (user.verificationToken !== token) {
         throw new UnauthenticatedError(
             'Account verification failed, invalid token',
         );
       }

       user.isVerified = true;
       user.verificationToken = '';
       await user.save();
    }
}