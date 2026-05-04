import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';

const logger = createLogger('GamificationService');

export class GamificationService {
  static async getLeaderboard(serverId: string, limit = 100) {
    const members = await prisma.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            xp: true,
          },
        },
      },
      take: limit,
    });

    return members
      .sort((a, b) => {
        if (b.user.level !== a.user.level) {
          return b.user.level - a.user.level;
        }
        return b.user.xp - a.user.xp;
      })
      .map((member, index) => ({
        rank: index + 1,
        ...member.user,
      }));
  }

  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        level: true,
        xp: true,
        badges: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    const totalXPNeeded = user.level * 100;
    const currentXP = user.xp % 100;
    const xpProgress = (currentXP / 100) * 100;

    return {
      ...user,
      xpProgress,
      totalXPNeeded,
      currentXP,
    };
  }

  static async addBadge(userId: string, badge: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { badges: true },
    });

    if (!user || user.badges.includes(badge)) return;

    await prisma.user.update({
      where: { id: userId },
      data: {
        badges: {
          push: badge,
        },
      },
    });

    logger.info({ userId, badge }, 'Badge added');
  }

  static async getGlobalLeaderboard(limit = 100) {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
      },
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' },
      ],
      take: limit,
    });
  }
}
