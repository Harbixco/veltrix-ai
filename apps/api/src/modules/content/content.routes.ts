import { Router } from 'express';
import {
  generateCopy,
  saveDraft,
  getDrafts,
  updateDraft
} from './content.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.post('/generate', generateCopy);
router.post('/drafts', saveDraft);
router.get('/drafts', getDrafts);
router.put('/drafts/:id', updateDraft);

export default router;
