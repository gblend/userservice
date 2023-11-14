import signUp from './create';
import verifyAccount from './verify_account';
import login from './login';
import logout from './logout';

export default {
  ...verifyAccount,
  ...login,
  ...logout,
  ...signUp,
};
