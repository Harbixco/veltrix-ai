import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getCalendarPosts,
  schedulePost,
  cancelScheduledPost,
  publishNow,
  updatePostMedia,
  batchApplyFacebookFlyer
} from './calendar.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/posts', getCalendarPosts);
router.post('/schedule', schedulePost);
router.patch('/posts/:id/media', updatePostMedia);
router.post('/posts/batch-flyer', batchApplyFacebookFlyer);
router.delete('/posts/:id', cancelScheduledPost);
router.post('/publish-now/:id', publishNow);

export default router;
