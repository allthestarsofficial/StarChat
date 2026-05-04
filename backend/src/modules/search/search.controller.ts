import { Request, Response } from 'express';
import { SearchService } from './search.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class SearchController {
  static searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { q, limit = 20 } = req.query;
    const results = await SearchService.searchUsers(
      q as string,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  });

  static searchServers = asyncHandler(async (req: Request, res: Response) => {
    const { q, limit = 20 } = req.query;
    const results = await SearchService.searchServers(
      q as string,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  });

  static searchMessages = asyncHandler(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { q, limit = 50 } = req.query;
    const results = await SearchService.searchMessages(
      channelId,
      q as string,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  });

  static globalSearch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q } = req.query;
    const results = await SearchService.globalSearch(q as string, req.userId!);

    res.status(200).json({
      success: true,
      data: results,
    });
  });

  static searchServerMembers = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const { q, limit = 50 } = req.query;
    const results = await SearchService.searchServerMembers(
      serverId,
      q as string,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  });
}
