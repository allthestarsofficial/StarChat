import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/core/config';
import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { UnauthorizedError, ConflictError, NotFoundError } from '@/common/errors';
import { RegisterInput, LoginInput } from '@/common/validation';

const logger = createLogger('AuthService');

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName?: string | null;
    avatar?: string | null;
  };
}

export class AuthService {
  static async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existingUser) {
      throw new ConflictError('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        displayName: input.displayName || input.username,
        password: hashedPassword,
      },
    });

    logger.info({ userId: user.id }, 'User registered successfully');

    return this.generateTokens(user);
  }

  static async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    logger.info({ userId: user.id }, 'User logged in successfully');

    return this.generateTokens(user);
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (err) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  private static generateTokens(user: any): AuthResponse {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    };
  }
}
