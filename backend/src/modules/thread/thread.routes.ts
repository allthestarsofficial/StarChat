import { Router } from 'express';
import { ThreadController } from './thread.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/channels/:channelId/threads', authMiddleware, ThreadController.createThread);
router.get('/:threadId', ThreadController.getThread);
router.get('/channels/:channelId/threads', ThreadController.getChannelThreads);
router.post('/:threadId/archive', authMiddleware, ThreadController.archiveThread);
router.delete('/:threadId', authMiddleware, ThreadController.deleteThread);

export default router;
