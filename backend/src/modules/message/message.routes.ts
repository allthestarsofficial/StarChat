import { Router } from 'express';
import { MessageController } from './message.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/channels/:channelId/messages', authMiddleware, MessageController.createMessage);
router.get('/:messageId', MessageController.getMessage);
router.patch('/:messageId', authMiddleware, MessageController.updateMessage);
router.delete('/:messageId', authMiddleware, MessageController.deleteMessage);
router.post('/:messageId/pin', authMiddleware, MessageController.pinMessage);
router.delete('/:messageId/pin', authMiddleware, MessageController.unpinMessage);
router.post('/:messageId/reactions', authMiddleware, MessageController.addReaction);
router.delete('/:messageId/reactions', authMiddleware, MessageController.removeReaction);
router.get('/:messageId/reactions', MessageController.getReactions);

export default router;
