import { Router } from 'express';
import {
  getWorkflows,
  createWorkflow,
  testTrigger
} from './automation.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/workflows', getWorkflows);
router.post('/workflows', createWorkflow);
router.post('/workflows/:id/trigger', testTrigger);

export default router;
