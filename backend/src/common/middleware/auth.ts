import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/core/config';
import { UnauthorizedError } from '../errors';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token expired'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(err);
  }
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      req.userId = decoded.userId;
      req.user = decoded;
    }
  } catch (err) {
    // Silent fail for optional auth
  }

  next();
};
