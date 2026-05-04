import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import { v4 as uuid } from 'uuid';

const logger = createLogger('ThreadService');

export class ThreadService {
  static async createThread(
    channelId: string,
    userId: string,
    name: string,
    description?: string
  ) {
    const thread = await prisma.thread.create({
      data: {
        name,
        description,
        channelId,
        creatorId: userId,
      },
    });

    logger.info({ threadId: thread.id, channelId }, 'Thread created');
    return thread;
  }

  static async getThread(threadId: string) {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!thread) throw new NotFoundError('Thread');
    return thread;
  }

  static async getChannelThreads(channelId: string, limit = 50) {
    const threads = await prisma.thread.findMany({
      where: { channelId, archived: false },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return threads;
  }

  static async archiveThread(threadId: string, userId: string) {
    const thread = await this.getThread(threadId);

    if (thread.creatorId !== userId) {
      throw new ForbiddenError('Only thread creator can archive');
    }

    return prisma.thread.update({
      where: { id: threadId },
      data: { archived: true },
    });
  }

  static async deleteThread(threadId: string, userId: string) {
    const thread = await this.getThread(threadId);

    if (thread.creatorId !== userId) {
      throw new ForbiddenError('Only thread creator can delete');
    }

    await prisma.thread.delete({
      where: { id: threadId },
    });
  }
}
