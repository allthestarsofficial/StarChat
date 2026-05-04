import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '@/common/middleware/error';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@/common/validation';
import { AuthRequest } from '@/common/middleware/auth';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const input = RegisterSchema.parse(req.body);
    const result = await AuthService.register(input);

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const input = LoginSchema.parse(req.body);
    const result = await AuthService.login(input);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = RefreshTokenSchema.parse(req.body);
    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  static me = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  });
}
