import { Router } from 'express';

import {
  login,
  logout,
  verifyEmail,
} from '../controllers';

import { authenticateUser } from '../middleware';
const router: Router = Router();

router.route('/login').post(login);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-account').post(verifyEmail);

export default router;
