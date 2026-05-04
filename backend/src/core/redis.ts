import Redis from 'ioredis';
import { createLogger } from './logger';
import { config } from './config';

const logger = createLogger('Redis');

const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (err) => {
  logger.error({ err }, 'Redis error');
});

redis.on('disconnect', () => {
  logger.warn('Disconnected from Redis');
});

export default redis;
