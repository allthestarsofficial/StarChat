import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

import { config } from '@/core/config';
import { createLogger } from '@/core/logger';
import { requestLogger } from '@/common/middleware/request-logger';
import { rateLimitMiddleware } from '@/common/middleware/rate-limit';
import { errorHandler } from '@/common/middleware/error';

// Routes
import authRoutes from '@/modules/auth/auth.routes';
import userRoutes from '@/modules/user/user.routes';
import serverRoutes from '@/modules/server/server.routes';
import channelRoutes from '@/modules/channel/channel.routes';
import messageRoutes from '@/modules/message/message.routes';
import threadRoutes from '@/modules/thread/thread.routes';
import botRoutes from '@/modules/bot/bot.routes';
import moderationRoutes from '@/modules/moderation/moderation.routes';
import searchRoutes from '@/modules/search/search.routes';
import gamificationRoutes from '@/modules/gamification/gamification.routes';

const logger = createLogger('App');

const app: Express = express();

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging & Rate Limiting
app.use(requestLogger);
app.use(rateLimitMiddleware);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/servers', serverRoutes);
app.use('/api/v1/channels', channelRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/bots', botRoutes);
app.use('/api/v1/moderation', moderationRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/gamification', gamificationRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Not found',
      code: 'NOT_FOUND',
    },
  });
});

// Error Handler
app.use(errorHandler);

export default app;
