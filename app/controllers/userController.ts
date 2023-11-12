import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../types';
import {
    adaptPaginateParams,
    adaptRequest,
} from '../lib/utils';
import {IPagination, IResponse} from '../interface';
import {UserService} from '../services/userService';

class UserController{
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    getAllUsers = async (
        req: Request,
        res: Response,
    ): Promise<Response<IResponse>> => {
        const {
            queryParams: { pageSize, pageNumber },
        } = adaptRequest(req);

        const {result, total, pages, previous, next}: IPagination = await this.userService.getUsers(adaptPaginateParams(pageSize, pageNumber));
        return res.status(StatusCodes.OK).json({
            message: 'Users fetched successfully',
            data: { users: result, pagination: {total, pages, previous, next} },
        });
    }

    getUser = async (
        req: Request,
        res: Response,
    ): Promise<Response<IResponse>> =>{
        const {
            pathParams: { id: userId },
            user: reqUser,
        } = adaptRequest(req);

        const user = await this.userService.findById(reqUser, userId);
        return res.status(StatusCodes.OK).json({ message: 'User details fetched successfully', data: { user } });
    }

    updateUser = async (
        req: Request,
        res: Response,
    ): Promise<Response<IResponse>> =>{
        const { user: reqUser, body, pathParams: {id: userId} } = adaptRequest(req);

        await this.userService.update(body, reqUser, userId);
        return res.status(StatusCodes.OK).json({
            message: 'Account information updated successfully',
        });
    }

    deleteUserAccount = async (
        req: Request,
        res: Response,
    ): Promise<Response<IResponse>> =>{
        const {
            pathParams: { id: userId },
            user: reqUser,
        } = adaptRequest(req);

        await this.userService.deleteById(reqUser, userId);
        return res.status(StatusCodes.OK).json({
            message: 'Account deleted successfully',
        });
    }

    getRoles = async (
        req: Request,
        res: Response
    ): Promise<Response<IResponse>> =>{
        console.log(JSON.stringify(this.userService))
        const roles = await this.userService.getUserRoles();

        return res.status(StatusCodes.OK).json({
            message: 'Roles fetched successfully',
            data: {
                roles
            }
        });
    }
}

export const userController: UserController = new UserController();
