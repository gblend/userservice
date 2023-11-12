import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './app/config/config';
import express, { Application } from 'express';
import { createServer } from 'http';
import {
  logger,
  serverStatus,
  xss,
} from './app/lib/utils';
import {
  errorHandler,
  eventHandler,
  responseInterceptor,
  routeNotFound,
} from './app/middleware';
import {
  apiDocRouter,
  authRouter,
  userRouter,
} from './app/routes';

export { initCron } from './app/scheduler';
export { dbConnection } from './app/config/db/connect';
const { env: appEnv, prefix, prodEnv } = config.app;

const app: Application = express();
const httpServer = createServer(app);

const apiRateLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: config.rateLimiter.max,
  standardHeaders: prodEnv,
});

app.use('/api', apiRateLimiter);
app.use(helmet());
app.use(xss());
app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
if (appEnv === 'development') app.use(morgan('dev'));

app.get(`${prefix}/status`, serverStatus);
app.use(responseInterceptor);
app.use('/', apiDocRouter);
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/users`, userRouter);

app.use(routeNotFound);
app.use(errorHandler);

process
  .on('SIGTERM', eventHandler('SIGTERM'))
  .on('unhandledRejection', eventHandler('unhandledRejection'))
  .on('uncaughtException', eventHandler('uncaughtException'));

export { logger, config, httpServer, appEnv, app };
