import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import { getSettings } from './settings.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/', getSettings);

export default router;
