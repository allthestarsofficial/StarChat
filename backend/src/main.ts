import app from './app';
import { createLogger } from './core/logger';
import { config } from './core/config';

const logger = createLogger('Server');

const PORT = config.app.port;

const server = app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      env: config.app.env,
      frontendUrl: config.app.frontendUrl,
    },
    `🚀 StarChat Backend running on port ${PORT}`
  );
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
