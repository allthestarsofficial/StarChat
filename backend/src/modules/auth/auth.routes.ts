import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.get('/me', authMiddleware, AuthController.me);

export default router;
