import { Request, Response } from 'express';
import { ChannelService } from './channel.service';
import { asyncHandler } from '@/common/middleware/error';
import { CreateChannelSchema } from '@/common/validation';
import { AuthRequest } from '@/common/middleware/auth';

export class ChannelController {
  static createChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    const input = CreateChannelSchema.parse(req.body);
    const channel = await ChannelService.createChannel(serverId, req.userId!, input);

    res.status(201).json({
      success: true,
      data: channel,
    });
  });

  static getChannel = asyncHandler(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const channel = await ChannelService.getChannel(channelId);

    res.status(200).json({
      success: true,
      data: channel,
    });
  });

  static getServerChannels = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const channels = await ChannelService.getServerChannels(serverId);

    res.status(200).json({
      success: true,
      data: channels,
    });
  });

  static updateChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { channelId } = req.params;
    const channel = await ChannelService.updateChannel(channelId, req.userId!, req.body);

    res.status(200).json({
      success: true,
      data: channel,
    });
  });

  static deleteChannel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { channelId } = req.params;
    await ChannelService.deleteChannel(channelId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Channel deleted' },
    });
  });

  static getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;

    const messages = await ChannelService.getMessages(
      channelId,
      parseInt(limit as string),
      before as string | undefined
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  });
}
