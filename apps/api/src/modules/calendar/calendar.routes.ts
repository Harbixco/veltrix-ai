import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getCalendarPosts,
  schedulePost,
  cancelScheduledPost,
  publishNow
} from './calendar.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/posts', getCalendarPosts);
router.post('/schedule', schedulePost);
router.delete('/posts/:id', cancelScheduledPost);
router.post('/publish-now/:id', publishNow);

export default router;
