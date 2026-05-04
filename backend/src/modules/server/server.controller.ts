import { Request, Response } from 'express';
import { ServerService } from './server.service';
import { asyncHandler } from '@/common/middleware/error';
import { CreateServerSchema } from '@/common/validation';
import { AuthRequest } from '@/common/middleware/auth';

export class ServerController {
  static createServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const input = CreateServerSchema.parse(req.body);
    const server = await ServerService.createServer(req.userId!, input);

    res.status(201).json({
      success: true,
      data: server,
    });
  });

  static getServer = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const server = await ServerService.getServerById(serverId);

    res.status(200).json({
      success: true,
      data: server,
    });
  });

  static updateServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    const server = await ServerService.updateServer(serverId, req.userId!, req.body);

    res.status(200).json({
      success: true,
      data: server,
    });
  });

  static deleteServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    await ServerService.deleteServer(serverId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Server deleted' },
    });
  });

  static getUserServers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const servers = await ServerService.getUserServers(req.userId!);

    res.status(200).json({
      success: true,
      data: servers,
    });
  });

  static joinServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    const server = await ServerService.joinServer(serverId, req.userId!);

    res.status(200).json({
      success: true,
      data: server,
    });
  });

  static leaveServer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    await ServerService.leaveServer(serverId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Left server' },
    });
  });

  static getMembers = asyncHandler(async (req: Request, res: Response) => {
    const { serverId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const members = await ServerService.getServerMembers(
      serverId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: members,
    });
  });

  static createInvite = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    const { maxUses } = req.body;

    const invite = await ServerService.createInvite(serverId, req.userId!, maxUses);

    res.status(201).json({
      success: true,
      data: invite,
    });
  });

  static getInvites = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { serverId } = req.params;
    const invites = await ServerService.getServerInvites(serverId, req.userId!);

    res.status(200).json({
      success: true,
      data: invites,
    });
  });
}
