import { Router } from 'express';
import { ServerController } from './server.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/', authMiddleware, ServerController.createServer);
router.get('/me/servers', authMiddleware, ServerController.getUserServers);
router.get('/:serverId', ServerController.getServer);
router.patch('/:serverId', authMiddleware, ServerController.updateServer);
router.delete('/:serverId', authMiddleware, ServerController.deleteServer);
router.post('/:serverId/join', authMiddleware, ServerController.joinServer);
router.post('/:serverId/leave', authMiddleware, ServerController.leaveServer);
router.get('/:serverId/members', ServerController.getMembers);
router.post('/:serverId/invites', authMiddleware, ServerController.createInvite);
router.get('/:serverId/invites', authMiddleware, ServerController.getInvites);

export default router;
