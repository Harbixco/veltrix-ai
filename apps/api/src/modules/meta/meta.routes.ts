import { Router } from 'express';
import {
  getPages,
  getOAuthUrl,
  connectPage,
  updatePageToken,
  syncPage,
  disconnectPage,
  getRecentPosts
} from './meta.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/pages', getPages);
router.get('/oauth-url', getOAuthUrl);
router.post('/connect-page', connectPage);
router.post('/pages/:pageId/token', updatePageToken);
router.post('/sync/:pageId', syncPage);
router.delete('/pages/:pageId', disconnectPage);
router.get('/posts', getRecentPosts);

export default router;
