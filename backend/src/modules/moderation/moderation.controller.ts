import { Request, Response } from 'express';
import { ModerationService } from './moderation.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class ModerationController {
  static warnUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId, userId } = req.params;
    const { reason } = req.body;

    const warn = await ModerationService.warnUser(
      serverId,
      userId,
      reason,
      req.userId!
    );

    res.status(201).json({
      success: true,
      data: warn,
    });
  });

  static getUserWarns = asyncHandler(async (req: Request, res: Response) => {
    const { serverId, userId } = req.params;
    const warns = await ModerationService.getUserWarns(
      userId,
      serverId === 'global' ? undefined : serverId
    );

    res.status(200).json({
      success: true,
      data: warns,
    });
  });

  static banUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId, userId } = req.params;
    const { reason, expiresAt } = req.body;

    const ban = await ModerationService.banUser(
      serverId,
      userId,
      reason,
      req.userId!,
      expiresAt ? new Date(expiresAt) : undefined
    );

    res.status(201).json({
      success: true,
      data: ban,
    });
  });

  static unbanUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId, userId } = req.params;
    await ModerationService.unbanUser(serverId, userId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'User unbanned' },
    });
  });

  static getBans = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const bans = await ModerationService.getUserBans(serverId);

    res.status(200).json({
      success: true,
      data: bans,
    });
  });

  static createAutoModeration = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { serverId } = req.params;
      const automod = await ModerationService.createAutoModeration(
        serverId,
        req.userId!,
        req.body
      );

      res.status(201).json({
        success: true,
        data: automod,
      });
    }
  );

  static getAutoModerations = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const automods = await ModerationService.getAutoModerations(serverId);

    res.status(200).json({
      success: true,
      data: automods,
    });
  });

  static getAuditLog = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await ModerationService.getAuditLog(
      serverId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}
