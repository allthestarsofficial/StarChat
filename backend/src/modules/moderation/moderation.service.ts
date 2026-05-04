import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';

const logger = createLogger('ModerationService');

export class ModerationService {
  static async warnUser(
    serverId: string,
    userId: string,
    reason: string,
    moderatorId: string
  ) {
    const warn = await prisma.warn.create({
      data: {
        userId,
        serverId,
        reason,
        moderatorId,
      },
    });

    logger.info({ userId, serverId, moderatorId }, 'User warned');
    return warn;
  }

  static async getUserWarns(userId: string, serverId?: string) {
    return prisma.warn.findMany({
      where: {
        userId,
        serverId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async banUser(
    serverId: string,
    userId: string,
    reason: string,
    moderatorId: string,
    expiresAt?: Date
  ) {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) throw new NotFoundError('Server');

    const ban = await prisma.ban.create({
      data: {
        userId,
        serverId,
        reason,
        moderatorId,
        expiresAt,
      },
    });

    // Remove from server
    await prisma.serverMember.deleteMany({
      where: { userId, serverId },
    });

    logger.info({ userId, serverId, moderatorId }, 'User banned');
    return ban;
  }

  static async unbanUser(serverId: string, userId: string, moderatorId: string) {
    await prisma.ban.deleteMany({
      where: { userId, serverId },
    });

    logger.info({ userId, serverId, moderatorId }, 'User unbanned');
  }

  static async getUserBans(serverId: string) {
    return prisma.ban.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createAutoModeration(
    serverId: string,
    userId: string,
    input: {
      name: string;
      trigger: string;
      triggerConfig?: string;
      action: string;
      actionDuration?: number;
    }
  ) {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server || server.ownerId !== userId) {
      throw new ForbiddenError();
    }

    const automod = await prisma.autoModeration.create({
      data: {
        serverId,
        ...input,
      },
    });

    logger.info({ automoderationId: automod.id, serverId }, 'Auto-moderation rule created');
    return automod;
  }

  static async getAutoModerations(serverId: string) {
    return prisma.autoModeration.findMany({
      where: { serverId },
    });
  }

  static async getAuditLog(
    serverId: string,
    limit = 50,
    offset = 0
  ) {
    const logs = await prisma.auditLog.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.auditLog.count({
      where: { serverId },
    });

    return { logs, total };
  }

  static async logAction(
    serverId: string,
    action: string,
    userId?: string,
    targetId?: string,
    changes?: any,
    reason?: string
  ) {
    return prisma.auditLog.create({
      data: {
        serverId,
        action,
        userId,
        targetId,
        changes: changes ? JSON.stringify(changes) : null,
        reason,
      },
    });
  }
}
