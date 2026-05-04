import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../errors';
import redis from '@/core/redis';
import { config } from '@/core/config';

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, Math.ceil(config.rateLimit.windowMs / 1000));
    }

    res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimit.maxRequests - current));

    if (current > config.rateLimit.maxRequests) {
      const ttl = await redis.ttl(key);
      throw new RateLimitError('Too many requests', 'RATE_LIMITED', ttl);
    }

    next();
  } catch (err) {
    next(err);
  }
};
