import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import { CreateChannelSchema } from '@/common/validation';

const logger = createLogger('ChannelService');

export class ChannelService {
  static async createChannel(serverId: string, userId: string, input: any) {
    const server = await prisma.server.findUnique({ where: { id: serverId } });
    if (!server) throw new NotFoundError('Server');
    if (server.ownerId !== userId) throw new ForbiddenError();

    const validated = CreateChannelSchema.parse(input);

    const channel = await prisma.channel.create({
      data: {
        ...validated,
        serverId,
      },
    });

    logger.info({ channelId: channel.id, serverId }, 'Channel created');
    return channel;
  }

  static async getChannel(channelId: string) {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        messages: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
            reactions: true,
            attachments: true,
          },
        },
      },
    });

    if (!channel) throw new NotFoundError('Channel');
    return channel;
  }

  static async getServerChannels(serverId: string) {
    const channels = await prisma.channel.findMany({
      where: { serverId },
      orderBy: { position: 'asc' },
      include: {
        children: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return channels;
  }

  static async updateChannel(channelId: string, userId: string, input: any) {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { server: true },
    });

    if (!channel?.server) throw new NotFoundError('Channel');
    if (channel.server.ownerId !== userId) throw new ForbiddenError();

    const updated = await prisma.channel.update({
      where: { id: channelId },
      data: input,
    });

    logger.info({ channelId, userId }, 'Channel updated');
    return updated;
  }

  static async deleteChannel(channelId: string, userId: string) {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { server: true },
    });

    if (!channel?.server) throw new NotFoundError('Channel');
    if (channel.server.ownerId !== userId) throw new ForbiddenError();

    await prisma.channel.delete({
      where: { id: channelId },
    });

    logger.info({ channelId, userId }, 'Channel deleted');
  }

  static async getMessages(
    channelId: string,
    limit = 50,
    before?: string
  ) {
    const where: any = { channelId };

    const messages = await prisma.message.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.reverse();
  }
}
