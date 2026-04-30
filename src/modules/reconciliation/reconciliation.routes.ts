import { Router } from 'express';
import {
  getPositions,
  getReconciliationRunById,
  getReconciliationRuns,
  reviewReconciliationBreak,
  runReconciliation,
  runReconciliationSeed,
} from './reconciliation.controller';

const router = Router();

router.post('/seed/run', runReconciliationSeed);
router.get('/positions', getPositions);
router.post('/run', runReconciliation);
router.get('/runs', getReconciliationRuns);
router.get('/runs/:id', getReconciliationRunById);
router.patch('/breaks/:id/review', reviewReconciliationBreak);

export default router;