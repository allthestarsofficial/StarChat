import { Router } from 'express';
import { ChannelController } from './channel.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/servers/:serverId/channels', authMiddleware, ChannelController.createChannel);
router.get('/servers/:serverId/channels', ChannelController.getServerChannels);
router.get('/:channelId', ChannelController.getChannel);
router.patch('/:channelId', authMiddleware, ChannelController.updateChannel);
router.delete('/:channelId', authMiddleware, ChannelController.deleteChannel);
router.get('/:channelId/messages', ChannelController.getMessages);

export default router;
