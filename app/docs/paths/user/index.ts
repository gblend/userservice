import updateAccount from './update_account';
import userDetails from './user';
import userRoles from './roles';
import deleteAccount from './delete_account';
import users from './users';

export default {
  ...updateAccount,
  ...userDetails,
  ...userRoles,
  ...users,
  ...deleteAccount,
};
