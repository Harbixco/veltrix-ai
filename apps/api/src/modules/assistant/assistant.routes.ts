import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation
} from './assistant.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/conversations', getConversations);
router.get('/conversations/:id', getMessages);
router.post('/chat', sendMessage);
router.delete('/conversations/:id', deleteConversation);

export default router;
