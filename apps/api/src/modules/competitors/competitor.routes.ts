import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { tenantGuard } from '../../middleware/tenantGuard';
import {
  getCompetitors,
  createCompetitor,
  deleteCompetitor
} from './competitor.controller';

const router = Router();

router.use(authenticate, tenantGuard);

router.get('/', getCompetitors);
router.post('/', createCompetitor);
router.delete('/:id', deleteCompetitor);

export default router;
