import { Request, Response } from 'express';
import { ThreadService } from './thread.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class ThreadController {
  static createThread = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { channelId } = req.params;
    const { name, description } = req.body;

    const thread = await ThreadService.createThread(
      channelId,
      req.userId!,
      name,
      description
    );

    res.status(201).json({
      success: true,
      data: thread,
    });
  });

  static getThread = asyncHandler(async (req: Request, res: Response) => {
    const { threadId } = req.params;
    const thread = await ThreadService.getThread(threadId);

    res.status(200).json({
      success: true,
      data: thread,
    });
  });

  static getChannelThreads = asyncHandler(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { limit = 50 } = req.query;

    const threads = await ThreadService.getChannelThreads(
      channelId,
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: threads,
    });
  });

  static archiveThread = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { threadId } = req.params;
    const thread = await ThreadService.archiveThread(threadId, req.userId!);

    res.status(200).json({
      success: true,
      data: thread,
    });
  });

  static deleteThread = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { threadId } = req.params;
    await ThreadService.deleteThread(threadId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Thread deleted' },
    });
  });
}
