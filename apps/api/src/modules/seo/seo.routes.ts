import { Router } from 'express';
import { auditUrl, getKeywords, generateOutline } from './seo.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.post('/audit', auditUrl);
router.get('/keywords', getKeywords);
router.post('/outline', generateOutline);

export default router;
