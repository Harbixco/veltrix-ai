import { Router } from 'express';
import {
  getOverview,
  getRankedPosts,
  getDiagnosis,
  getComparison
} from './analytics.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/overview', getOverview);
router.get('/ranked-posts', getRankedPosts);
router.get('/post/:postId/diagnosis', getDiagnosis);
router.get('/comparison', getComparison);

export default router;
