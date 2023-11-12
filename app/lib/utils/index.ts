export {
  createJWT,
  isTokenValid,
} from './jwt';
export { checkPermissions } from './check_permission';
import mailer from './email/sendEmail';

export { formatValidationError } from './format_joi_validation_error';
export { constants } from './constant';
export { adaptRequest } from './adapt_request';
export { capitalizeFirstCharacter } from './capitalize_first_character';
export { logger } from './logger';
export { appStatus, serverStatus } from './app_status';
export { generateToken } from './verification_token';
export { xss } from './xss_clean';
export { appRoutes } from './registered_routes';
export { mapPaginatedData } from './paginate/map_data';
export { adaptPaginateParams } from './paginate/adapt_params';
export { StatusCodes } from 'http-status-codes';
export { useCallback } from './use_callback';
export const sendVerificationEmail: (...args: any) => void =
  mailer.sendVerificationEmail;
export {
  userValidator
} from './validator';
