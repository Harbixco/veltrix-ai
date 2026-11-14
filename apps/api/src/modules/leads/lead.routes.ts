import { Router } from 'express';
import {
  getLeads,
  createLead,
  updateStage,
  addActivity,
  generateWhatsAppLink,
  getOpportunities
} from './lead.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id/stage', updateStage);
router.post('/:id/activities', addActivity);
router.post('/whatsapp-link', generateWhatsAppLink);
router.get('/opportunities', getOpportunities);

export default router;
