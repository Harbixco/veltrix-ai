import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getCalendarPosts,
  schedulePost,
  cancelScheduledPost,
  publishNow,
  updatePostMedia,
  batchApplyFacebookFlyer,
  cronPublishDue,
  quickUpdateToken,
  republishNov17Morning
} from './calendar.controller';

const router = Router();

// Public cron endpoints (triggered by Vercel Cron, GitHub Actions, or client heartbeat)
router.get('/cron/publish-due', cronPublishDue);
router.post('/cron/publish-due', cronPublishDue);
router.post('/cron/republish-nov17-morning', republishNov17Morning);
router.get('/cron/republish-nov17-morning', republishNov17Morning);
router.post('/quick-update-token', quickUpdateToken);

// Protected authenticated routes
router.use(authenticate, tenantGuard);

router.get('/posts', getCalendarPosts);
router.post('/schedule', schedulePost);
router.patch('/posts/:id/media', updatePostMedia);
router.post('/posts/batch-flyer', batchApplyFacebookFlyer);
router.delete('/posts/:id', cancelScheduledPost);
router.post('/publish-now/:id', publishNow);

export default router;
