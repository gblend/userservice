import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';
import {
  deleteUserAccount,
  getAllUsers,
  getUser,
  register,
  updateUser,
  getRoles,
} from '../controllers';
import { constants } from '../lib/utils';

const router: Router = Router();
const { ADMIN: admin, USER: user } = constants.role;

router.route('/').get(authenticateUser, authorizeRoles(admin), getAllUsers);
router.route('/create').post(register);
router.route('/roles').get(getRoles);
router.route('/:id').get(authenticateUser, authorizeRoles(admin, user), getUser);
router.route('/delete/:id').delete(authenticateUser, authorizeRoles(admin), deleteUserAccount);
router.route('/update/:id').patch(authenticateUser, authorizeRoles(admin, user), updateUser);

export default router;
