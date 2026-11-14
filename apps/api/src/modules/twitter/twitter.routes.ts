import { Router } from 'express';
import {
  getAccounts,
  connectAccount,
  disconnectAccount,
  formatTweet
} from './twitter.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/accounts', getAccounts);
router.post('/connect', connectAccount);
router.delete('/accounts/:handle', disconnectAccount);
router.post('/format', formatTweet);

export default router;
