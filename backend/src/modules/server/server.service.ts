import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import { CreateServerInput, UpdateServerSchema } from '@/common/validation';
import { v4 as uuid } from 'uuid';

const logger = createLogger('ServerService');

export class ServerService {
  static async createServer(ownerId: string, input: CreateServerInput) {
    const server = await prisma.server.create({
      data: {
        ...input,
        ownerId,
        vanityUrl: input.name.toLowerCase().replace(/\s+/g, '-') + '-' + uuid().slice(0, 8),
      },
      include: {
        channels: true,
        members: true,
      },
    });

    // Add owner as member
    await prisma.serverMember.create({
      data: {
        userId: ownerId,
        serverId: server.id,
      },
    });

    logger.info({ serverId: server.id, ownerId }, 'Server created');
    return server;
  }

  static async getServerById(serverId: string) {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        channels: {
          orderBy: { position: 'asc' },
        },
        roles: true,
        members: {
          select: {
            user: {
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

    if (!server) {
      throw new NotFoundError('Server');
    }

    return server;
  }

  static async updateServer(serverId: string, userId: string, input: any) {
    const server = await this.getServerById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError('Only server owner can update settings');
    }

    const validated = UpdateServerSchema.parse(input);

    const updated = await prisma.server.update({
      where: { id: serverId },
      data: validated,
    });

    logger.info({ serverId, userId }, 'Server updated');
    return updated;
  }

  static async deleteServer(serverId: string, userId: string) {
    const server = await this.getServerById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError('Only server owner can delete server');
    }

    await prisma.server.delete({
      where: { id: serverId },
    });

    logger.info({ serverId, userId }, 'Server deleted');
  }

  static async getUserServers(userId: string) {
    const servers = await prisma.server.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        channels: {
          take: 5,
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return servers;
  }

  static async joinServer(serverId: string, userId: string) {
    const server = await this.getServerById(serverId);

    if (!server.isPublic) {
      throw new ForbiddenError('Server is private');
    }

    const existing = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    });

    if (existing) {
      return server;
    }

    await prisma.serverMember.create({
      data: {
        userId,
        serverId,
      },
    });

    await prisma.server.update({
      where: { id: serverId },
      data: {
        memberCount: {
          increment: 1,
        },
      },
    });

    logger.info({ serverId, userId }, 'User joined server');
    return server;
  }

  static async leaveServer(serverId: string, userId: string) {
    const server = await this.getServerById(serverId);

    if (server.ownerId === userId) {
      throw new ForbiddenError('Owner cannot leave server');
    }

    await prisma.serverMember.delete({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    });

    await prisma.server.update({
      where: { id: serverId },
      data: {
        memberCount: {
          decrement: 1,
        },
      },
    });

    logger.info({ serverId, userId }, 'User left server');
  }

  static async getServerMembers(serverId: string, limit = 50, offset = 0) {
    const members = await prisma.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            status: true,
            level: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    return members;
  }

  static async createInvite(serverId: string, userId: string, maxUses?: number) {
    const server = await this.getServerById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError('Only owner can create invites');
    }

    const code = uuid().slice(0, 8).toUpperCase();

    const invite = await prisma.serverInvite.create({
      data: {
        code,
        serverId,
        createdBy: userId,
        maxUses,
      },
    });

    return invite;
  }

  static async getServerInvites(serverId: string, userId: string) {
    const server = await this.getServerById(serverId);

    if (server.ownerId !== userId) {
      throw new ForbiddenError('Only owner can view invites');
    }

    return prisma.serverInvite.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
