import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), 'backend', '.env');
dotenv.config({ path: envPath });

export interface Config {
  app: {
    env: 'development' | 'production' | 'test';
    debug: boolean;
    port: number;
    frontendUrl: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  storage: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    region: string;
  };
  cors: {
    origin: string | string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'MINIO_ENDPOINT',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  app: {
    env: (process.env.APP_ENV as any) || 'development',
    debug: process.env.APP_DEBUG === 'true',
    port: parseInt(process.env.BACKEND_PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  storage: {
    endpoint: process.env.MINIO_ENDPOINT!,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    bucket: process.env.MINIO_BUCKET || 'starchat',
    region: process.env.MINIO_REGION || 'us-east-1',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export default config;
