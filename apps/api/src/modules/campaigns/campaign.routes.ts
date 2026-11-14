import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from './campaign.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.patch('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

export default router;
