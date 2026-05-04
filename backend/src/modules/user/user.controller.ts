import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '@/common/middleware/error';
import { AuthRequest } from '@/common/middleware/auth';

export class UserController {
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.getUserById(req.userId!);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  static getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await UserService.getUserByUsername(username);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserService.updateProfile(req.userId!, req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  static setStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, statusText } = req.body;
    const result = await UserService.setStatus(req.userId!, status, statusText);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  static followUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId: targetUserId } = req.params;
    await UserService.followUser(req.userId!, targetUserId);

    res.status(200).json({
      success: true,
      data: { message: 'User followed' },
    });
  });

  static unfollowUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId: targetUserId } = req.params;
    await UserService.unfollowUser(req.userId!, targetUserId);

    res.status(200).json({
      success: true,
      data: { message: 'User unfollowed' },
    });
  });

  static getFollowing = asyncHandler(async (req: AuthRequest, res: Response) => {
    const following = await UserService.getFollowing(req.userId!);

    res.status(200).json({
      success: true,
      data: following,
    });
  });

  static getFollowers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    const followers = await UserService.getFollowers(userId);

    res.status(200).json({
      success: true,
      data: followers,
    });
  });
}
