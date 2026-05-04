import { prisma } from '@/core/prisma';
import { createLogger } from '@/core/logger';
import { NotFoundError, ForbiddenError } from '@/common/errors';
import { v4 as uuid } from 'uuid';

const logger = createLogger('BotService');

export class BotService {
  static async createBot(ownerId: string, name: string, description?: string) {
    const token = uuid();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        ownerId,
        token,
        avatar,
      },
    });

    logger.info({ botId: bot.id, ownerId }, 'Bot created');
    return bot;
  }

  static async getBotById(botId: string) {
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        commands: true,
        automations: true,
      },
    });

    if (!bot) throw new NotFoundError('Bot');
    return bot;
  }

  static async getUserBots(userId: string) {
    return prisma.bot.findMany({
      where: { ownerId: userId },
      include: {
        commands: true,
        invites: {
          select: { id: true, code: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateBot(
    botId: string,
    userId: string,
    input: {
      name?: string;
      description?: string;
      prefix?: string;
      isPublic?: boolean;
    }
  ) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError('Only bot owner can update settings');
    }

    return prisma.bot.update({
      where: { id: botId },
      data: input,
    });
  }

  static async deleteBot(botId: string, userId: string) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError('Only bot owner can delete bot');
    }

    await prisma.bot.delete({
      where: { id: botId },
    });

    logger.info({ botId, userId }, 'Bot deleted');
  }

  static async createCommand(
    botId: string,
    userId: string,
    input: {
      name: string;
      description: string;
      trigger: string;
      response: string;
      cooldown?: number;
    }
  ) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError();
    }

    const command = await prisma.botCommand.create({
      data: {
        botId,
        ...input,
      },
    });

    logger.info({ commandId: command.id, botId }, 'Command created');
    return command;
  }

  static async updateCommand(
    commandId: string,
    botId: string,
    userId: string,
    input: any
  ) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError();
    }

    return prisma.botCommand.update({
      where: { id: commandId },
      data: input,
    });
  }

  static async deleteCommand(commandId: string, botId: string, userId: string) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError();
    }

    await prisma.botCommand.delete({
      where: { id: commandId },
    });
  }

  static async createAutomation(
    botId: string,
    userId: string,
    input: {
      name: string;
      description?: string;
      event: string;
      condition?: string;
      action: string;
      actionData: string;
    }
  ) {
    const bot = await this.getBotById(botId);

    if (bot.ownerId !== userId) {
      throw new ForbiddenError();
    }

    const automation = await prisma.botAutomation.create({
      data: {
        botId,
        ...input,
      },
    });

    logger.info({ automationId: automation.id, botId }, 'Automation created');
    return automation;
  }

  static async getPublicBots(limit = 50, offset = 0) {
    return prisma.bot.findMany({
      where: { isPublic: true },
      include: {
        _count: {
          select: { invites: true },
        },
      },
      orderBy: { inviteCount: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
