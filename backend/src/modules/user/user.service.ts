import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError } from '@/common/errors';
import { UpdateProfileSchema } from '@/common/validation';

const logger = createLogger('UserService');

export class UserService {
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
        status: true,
        statusText: true,
        statusEmoji: true,
        badges: true,
        level: true,
        xp: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  static async getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
        status: true,
        statusText: true,
        statusEmoji: true,
        badges: true,
        level: true,
        xp: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  static async updateProfile(userId: string, input: any) {
    const validated = UpdateProfileSchema.parse(input);

    const user = await prisma.user.update({
      where: { id: userId },
      data: validated,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        banner: true,
        bio: true,
        status: true,
        statusText: true,
        theme: true,
        compactMode: true,
      },
    });

    logger.info({ userId }, 'User profile updated');
    return user;
  }

  static async setStatus(
    userId: string,
    status: 'online' | 'idle' | 'dnd' | 'invisible',
    statusText?: string
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        status,
        statusText: statusText || null,
        lastSeenAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        status: true,
        statusText: true,
      },
    });
  }

  static async followUser(userId: string, targetUserId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          connect: { id: targetUserId },
        },
      },
    });
  }

  static async unfollowUser(userId: string, targetUserId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          disconnect: { id: targetUserId },
        },
      },
    });
  }

  static async getFollowing(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    return user?.following || [];
  }

  static async getFollowers(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    return user?.followers || [];
  }

  static async addXP(userId: string, amount: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level

    return prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
      select: {
        id: true,
        level: true,
        xp: true,
      },
    });
  }
}
