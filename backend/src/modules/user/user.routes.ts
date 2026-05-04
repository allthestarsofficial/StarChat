import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.get('/me', authMiddleware, UserController.getProfile);
router.get('/@:username', UserController.getUserByUsername);
router.patch('/me', authMiddleware, UserController.updateProfile);
router.post('/me/status', authMiddleware, UserController.setStatus);
router.post('/:userId/follow', authMiddleware, UserController.followUser);
router.delete('/:userId/follow', authMiddleware, UserController.unfollowUser);
router.get('/me/following', authMiddleware, UserController.getFollowing);
router.get('/:userId/followers', UserController.getFollowers);

export default router;
