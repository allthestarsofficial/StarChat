import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import { CreateMessageSchema, UpdateMessageSchema } from '@/common/validation';

const logger = createLogger('MessageService');

export class MessageService {
  static async createMessage(channelId: string, userId: string, input: any) {
    const validated = CreateMessageSchema.parse(input);

    const message = await prisma.message.create({
      data: {
        ...validated,
        channelId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
          },
        },
        attachments: true,
        reactions: true,
      },
    });

    // Update message count
    await prisma.channel.update({
      where: { id: channelId },
      data: {
        server: {
          update: {
            messageCount: { increment: 1 },
          },
        },
      },
    });

    // Add XP to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: 10 },
      },
    });

    logger.info({ messageId: message.id, channelId, userId }, 'Message created');
    return message;
  }

  static async getMessage(messageId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        author: true,
        reactions: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
        attachments: true,
        editHistory: true,
      },
    });

    if (!message) throw new NotFoundError('Message');
    return message;
  }

  static async updateMessage(messageId: string, userId: string, input: any) {
    const message = await this.getMessage(messageId);

    if (message.authorId !== userId) {
      throw new ForbiddenError('Can only edit own messages');
    }

    const validated = UpdateMessageSchema.parse(input);

    // Save edit history
    await prisma.messageEdit.create({
      data: {
        messageId,
        content: message.content,
      },
    });

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content: validated.content,
        editedAt: new Date(),
      },
      include: {
        author: true,
        reactions: true,
        attachments: true,
        editHistory: true,
      },
    });

    logger.info({ messageId, userId }, 'Message updated');
    return updated;
  }

  static async deleteMessage(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    if (message.authorId !== userId) {
      throw new ForbiddenError('Can only delete own messages');
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    logger.info({ messageId, userId }, 'Message deleted');
  }

  static async pinMessage(messageId: string, userId: string) {
    const message = await this.getMessage(messageId);

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        pinnedAt: new Date(),
        pinnedById: userId,
      },
      include: {
        author: true,
        reactions: true,
      },
    });

    logger.info({ messageId, userId }, 'Message pinned');
    return updated;
  }

  static async unpinMessage(messageId: string) {
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        pinnedAt: null,
        pinnedById: null,
      },
    });

    return updated;
  }

  static async addReaction(messageId: string, userId: string, emoji: string) {
    await this.getMessage(messageId);

    const reaction = await prisma.reaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
      update: {},
      create: {
        messageId,
        userId,
        emoji,
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    return reaction;
  }

  static async removeReaction(messageId: string, userId: string, emoji: string) {
    await prisma.reaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });
  }

  static async getReactions(messageId: string) {
    const reactions = await prisma.reaction.groupBy({
      by: ['emoji'],
      where: { messageId },
      _count: true,
    });

    return reactions;
  }
}
