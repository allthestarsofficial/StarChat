import { Router } from 'express';
import { GamificationController } from './gamification.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.get('/servers/:serverId/leaderboard', GamificationController.getServerLeaderboard);
router.get('/global/leaderboard', GamificationController.getGlobalLeaderboard);
router.get('/me/stats', authMiddleware, GamificationController.getUserStats);
router.get('/:userId/stats', GamificationController.getPublicUserStats);

export default router;
