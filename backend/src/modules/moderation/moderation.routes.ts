import { Router } from 'express';
import { ModerationController } from './moderation.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/servers/:serverId/warn/:userId', authMiddleware, ModerationController.warnUser);
router.get('/servers/:serverId/warns/:userId', ModerationController.getUserWarns);
router.post('/servers/:serverId/ban/:userId', authMiddleware, ModerationController.banUser);
router.delete('/servers/:serverId/ban/:userId', authMiddleware, ModerationController.unbanUser);
router.get('/servers/:serverId/bans', ModerationController.getBans);
router.post('/servers/:serverId/automoderations', authMiddleware, ModerationController.createAutoModeration);
router.get('/servers/:serverId/automoderations', ModerationController.getAutoModerations);
router.get('/servers/:serverId/audit-logs', authMiddleware, ModerationController.getAuditLog);

export default router;
