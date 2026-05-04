import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';

const logger = createLogger('SearchService');

export class SearchService {
  static async searchUsers(query: string, limit = 20) {
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        status: true,
        level: true,
      },
      take: limit,
    });
  }

  static async searchServers(query: string, limit = 20) {
    return prisma.server.findMany({
      where: {
        AND: [
          { isPublic: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        memberCount: true,
        _count: {
          select: { members: true },
        },
      },
      take: limit,
    });
  }

  static async searchMessages(
    channelId: string,
    query: string,
    limit = 50
  ) {
    return prisma.message.findMany({
      where: {
        channelId,
        content: { contains: query, mode: 'insensitive' },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async globalSearch(query: string, userId: string) {
    const [users, servers, bots] = await Promise.all([
      this.searchUsers(query, 10),
      this.searchServers(query, 10),
      prisma.bot.findMany({
        where: {
          AND: [
            { isPublic: true },
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          ],
        },
        take: 10,
      }),
    ]);

    logger.info({ query, userId }, 'Global search performed');

    return { users, servers, bots };
  }

  static async searchServerMembers(serverId: string, query: string, limit = 50) {
    return prisma.serverMember.findMany({
      where: {
        serverId,
        user: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            status: true,
          },
        },
      },
      take: limit,
    });
  }
}
