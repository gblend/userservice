import User, {IUserAttributes} from '../models/User';
import {checkPermissions, formatValidationError, logger, mapPaginatedData, userValidator} from '../lib/utils';
import {StatusCodes} from 'http-status-codes';
import NotFoundError from '../lib/errors/not_found';
import {IPagination, ITokenUser, IUser} from '../interface';
import {BadRequestError} from '../lib/errors';
import Role from '../models/Role';

export class UserService{
    private readonly includeOptions = {include: [{model: Role, attributes: ['id', 'name']}],
        attributes: ['firstname', 'lastname', 'email', 'id', 'createdAt', 'updatedAt', 'isVerified']};

    async getUsers({pageSize, pageNumber, offset}: {pageSize: number, pageNumber: number, offset: number}): Promise<IPagination>{
        const users: User[] = await User.findAll({offset, limit: pageSize, ...this.includeOptions});

        if (!users.length) {
            logger.error(`${StatusCodes.NOT_FOUND} - No user found for get_users`);
            throw new NotFoundError('No user found.');
        }

        logger.info(`users retrieved successfully`);
        return mapPaginatedData(users, pageSize, pageNumber);
    }

    async findById(reqUser: ITokenUser, userId: number): Promise<User|null>{
        const user: User|null = await User.findOne({where: {id: userId}, ...this.includeOptions});

        if (!user) {
            logger.error(`${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for get_user`);
            throw new NotFoundError(`User does not exist`);
        }

        checkPermissions(reqUser, user.id);
        logger.info(`${StatusCodes.OK} - User details fetched successfully`);

        return user;
    }

    async update(payload: IUser, reqUser: ITokenUser, userId: number): Promise<number|null>{
        try {
            payload.id = userId;
            const { error } = userValidator.validateUpdateUserDto(payload);
            if (error) {
                throw new BadRequestError(formatValidationError(error).toLocaleString());
            }

            await this.findById(reqUser, userId);
            const [affectedRows] = await User.update(payload, {where: {id: userId}});

            if (!affectedRows) {
                logger.error(
                    JSON.stringify(
                        `${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for update_account`,
                    ),
                );
                throw new NotFoundError(`Unable to update account`);
            }

            return affectedRows;
        } catch (error: any) {
            this.composeError(error);
        }

        return null;
    }

    async deleteById(reqUser: ITokenUser, userId: string): Promise<number>{
        const affectedCount: number = await User.destroy({where: {id: userId}});

        if (!affectedCount) {
            logger.error(
                `${StatusCodes.NOT_FOUND} - No account found with id ${userId}`,
            );
            throw new NotFoundError(`Account not found`);
        }

        logger.info(`Account successfully deleted by ${reqUser.role}`)
        return affectedCount;
    }

    async findOne(filter: any): Promise<User|null>{
        return  await User.findOne({...filter});
    }

    async create(user: IUserAttributes): Promise<User|null>{
        try {
            return await User.create(user);
        } catch (error: any) {
            this.composeError(error);
        }

        return null;
    }

    async getUserRoles(): Promise<Role[]>{
        const roles: Role[] = await Role.findAll({ attributes: ['id', 'name']});

        if (!roles.length) {
            throw new NotFoundError('No role found. Please seed roles');
        }
        return roles;
    }

    createJWT(user: User): Promise<string>{
        return User.createJWT(user);
    }

    createRefreshJWT(user: ITokenUser, refreshToken: string): Promise<string> {
        return User.createRefreshJWT(user, refreshToken);
    }

    comparePassword(enteredPassword: string, user: User): Promise<boolean> {
        return User.comparePassword(enteredPassword, user);
    }

    composeError(error: any): void {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new BadRequestError(error?.errors[0]?.message);
        }
        throw new Error(error.message);
    }
}