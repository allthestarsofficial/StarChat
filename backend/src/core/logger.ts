import pino from 'pino';
import path from 'path';

const isDev = process.env.APP_ENV === 'development';
const isDebug = process.env.APP_DEBUG === 'true';

const transport = isDev
  ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    })
  : undefined;

export const logger = pino(
  {
    level: isDebug ? 'debug' : 'info',
    base: {
      env: process.env.APP_ENV,
      version: process.env.npm_package_version,
    },
  },
  transport
);

export const createLogger = (module: string) => {
  return logger.child({ module });
};
