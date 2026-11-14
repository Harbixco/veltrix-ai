import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import { getExecutiveReport } from './report.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/executive', getExecutiveReport);

export default router;
