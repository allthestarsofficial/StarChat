import { Router } from 'express';
import { SearchController } from './search.controller';
import { authMiddleware, optionalAuthMiddleware } from '@/common/middleware/auth';

const router = Router();

router.get('/users', SearchController.searchUsers);
router.get('/servers', SearchController.searchServers);
router.get('/channels/:channelId/messages', SearchController.searchMessages);
router.get('/global', authMiddleware, SearchController.globalSearch);
router.get('/servers/:serverId/members', SearchController.searchServerMembers);

export default router;
