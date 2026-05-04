import { Request, Response } from 'express';
import { MessageService } from './message.service';
import { asyncHandler } from '@/common/middleware/error';
import { CreateMessageSchema, UpdateMessageSchema } from '@/common/validation';
import { AuthRequest } from '@/common/middleware/auth';

export class MessageController {
  static createMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { channelId } = req.params;
    const input = CreateMessageSchema.parse(req.body);
    const message = await MessageService.createMessage(channelId, req.userId!, input);

    res.status(201).json({
      success: true,
      data: message,
    });
  });

  static getMessage = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const message = await MessageService.getMessage(messageId);

    res.status(200).json({
      success: true,
      data: message,
    });
  });

  static updateMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    const message = await MessageService.updateMessage(messageId, req.userId!, req.body);

    res.status(200).json({
      success: true,
      data: message,
    });
  });

  static deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    await MessageService.deleteMessage(messageId, req.userId!);

    res.status(200).json({
      success: true,
      data: { message: 'Message deleted' },
    });
  });

  static pinMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    const message = await MessageService.pinMessage(messageId, req.userId!);

    res.status(200).json({
      success: true,
      data: message,
    });
  });

  static unpinMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    const message = await MessageService.unpinMessage(messageId);

    res.status(200).json({
      success: true,
      data: message,
    });
  });

  static addReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const reaction = await MessageService.addReaction(messageId, req.userId!, emoji);

    res.status(201).json({
      success: true,
      data: reaction,
    });
  });

  static removeReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messageId } = req.params;
    const { emoji } = req.body;
    await MessageService.removeReaction(messageId, req.userId!, emoji);

    res.status(200).json({
      success: true,
      data: { message: 'Reaction removed' },
    });
  });

  static getReactions = asyncHandler(async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const reactions = await MessageService.getReactions(messageId);

    res.status(200).json({
      success: true,
      data: reactions,
    });
  });
}
