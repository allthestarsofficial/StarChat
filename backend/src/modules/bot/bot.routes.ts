import { Router } from 'express';
import { BotController } from './bot.controller';
import { authMiddleware } from '@/common/middleware/auth';

const router = Router();

router.post('/', authMiddleware, BotController.createBot);
router.get('/me/bots', authMiddleware, BotController.getUserBots);
router.get('/public', BotController.getPublicBots);
router.get('/:botId', BotController.getBot);
router.patch('/:botId', authMiddleware, BotController.updateBot);
router.delete('/:botId', authMiddleware, BotController.deleteBot);
router.post('/:botId/commands', authMiddleware, BotController.createCommand);
router.patch('/:botId/commands/:commandId', authMiddleware, BotController.updateCommand);
router.delete('/:botId/commands/:commandId', authMiddleware, BotController.deleteCommand);
router.post('/:botId/automations', authMiddleware, BotController.createAutomation);

export default router;
