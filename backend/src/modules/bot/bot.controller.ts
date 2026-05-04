import { Request, Response } from 'express';
import { BotService } from './bot.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class BotController {
  static createBot = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const bot = await BotService.createBot(req.userId!, name, description);

    res.status(201).json({
      success: true,
      data: bot,
    });
  });

  static getBot = asyncHandler(async (req: Request, res: Response) => {
    const { botId } = req.params;
    const bot = await BotService.getBotById(botId);

    res.status(200).json({
      success: true,
      data: bot,
    });
  });

  static getUserBots = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bots = await BotService.getUserBots(req.userId!);

    res.status(200).json({
      success: true,
      data: bots,
    });
  });

  static updateBot = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId } = req.params;
    const bot = await BotService.updateBot(botId, req.userId!, req.body);

    res.status(200).json({
      success: true,
      data: bot,
    });
  });

  static deleteBot = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId } = req.params;
    await BotService.deleteBot(botId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Bot deleted' },
    });
  });

  static createCommand = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId } = req.params;
    const command = await BotService.createCommand(botId, req.userId!, req.body);

    res.status(201).json({
      success: true,
      data: command,
    });
  });

  static updateCommand = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId, commandId } = req.params;
    const command = await BotService.updateCommand(
      commandId,
      botId,
      req.userId!,
      req.body
    );

    res.status(200).json({
      success: true,
      data: command,
    });
  });

  static deleteCommand = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId, commandId } = req.params;
    await BotService.deleteCommand(commandId, botId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Command deleted' },
    });
  });

  static createAutomation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { botId } = req.params;
    const automation = await BotService.createAutomation(
      botId,
      req.userId!,
      req.body
    );

    res.status(201).json({
      success: true,
      data: automation,
    });
  });

  static getPublicBots = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;
    const bots = await BotService.getPublicBots(
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: bots,
    });
  });
}
