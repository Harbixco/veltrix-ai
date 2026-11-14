import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getBrand,
  updateBrand,
  getServices,
  createService
} from './business.controller';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/brand', getBrand);
router.put('/brand', updateBrand);

router.get('/services', getServices);
router.post('/services', createService);

export default router;
