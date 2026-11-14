import { Router } from 'express';
import {
  getTemplates,
  saveDesign,
  getSavedDesigns
} from './design.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/templates', getTemplates);
router.post('/save', saveDesign);
router.get('/saved', getSavedDesigns);

export default router;
