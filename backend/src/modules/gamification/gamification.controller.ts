import { Request, Response } from 'express';
import { GamificationService } from './gamification.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class GamificationController {
  static getServerLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const { limit = 100 } = req.query;

    const leaderboard = await GamificationService.getLeaderboard(
      serverId,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  });

  static getGlobalLeaderboard = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 100 } = req.query;

    const leaderboard = await GamificationService.getGlobalLeaderboard(
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  });

  static getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await GamificationService.getUserStats(req.userId!);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  static getPublicUserStats = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const stats = await GamificationService.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}
