import {userController} from './userController';
import {authController} from './authController';

export const {
  register,
  login,
  logout,
  verifyEmail,
} = authController;

export const {
  deleteUserAccount,
  getAllUsers,
  getUser,
  updateUser,
  getRoles,
} = userController
