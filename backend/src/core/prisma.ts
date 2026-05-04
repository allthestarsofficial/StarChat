import { PrismaClient } from '@prisma/client';
import { createLogger } from './logger';

const logger = createLogger('PrismaClient');

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.APP_DEBUG === 'true' ? ['query', 'error', 'warn'] : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = global as unknown as { prisma: PrismaClientSingleton };

export const prisma =
  globalForPrisma.prisma ??
  prismaClientSingleton();

if (process.env.APP_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, disconnecting from database');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, disconnecting from database');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
