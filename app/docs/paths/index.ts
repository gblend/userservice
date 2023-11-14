import healthEndpoints from './health/status';
import authEndpoints from './auth';
import userEndpoints from './user';

export default {
  paths: {
    ...healthEndpoints,
    ...authEndpoints,
    ...userEndpoints,
  },
};
