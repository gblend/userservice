import {
  adaptRequest,
} from '../lib/utils';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../types/index';
import {IResponse, ITokenUser} from '../interface';
import {AuthService} from '../services/authService';

 class AuthController{
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

     register = async (req: Request, res: Response): Promise<Response<IResponse>> =>{
    const { body, ip, headers } = adaptRequest(req);
    const {accessToken, refreshToken, user} = await this.authService.register(body, ip, headers);

    return res.status(StatusCodes.OK).json({
      message: 'Please check your email for a link to verify your account',
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        user,
      },
    });
  }

     login = async (req: Request, res: Response): Promise<Response<IResponse>> =>{
    const { body, headers, ip } = adaptRequest(req);
    const {accessToken, refreshToken, verificationMsg, user} = await this.authService.login(body, ip, headers);

    return res.json({
      data: {
        token: accessToken,
        refreshToken: refreshToken,
        verificationMsg,
        user,
      },
      message: 'Login successful',
    });
  };

     logout = async (req: Request, res: Response): Promise<any> =>{
    const {
      user
    }: { user: ITokenUser } = adaptRequest(req);

    await this.authService.logout(user);
    res.status(StatusCodes.NO_CONTENT).json({});
  }

     verifyEmail = async (req: Request, res: Response): Promise<any> =>{
    const {
      body,
    } = adaptRequest(req);

    await this.authService.verifyEmail(body);
    res.status(StatusCodes.OK).json({ message: 'Account successfully verified' });
  }
}

export const authController: AuthController = new AuthController();
