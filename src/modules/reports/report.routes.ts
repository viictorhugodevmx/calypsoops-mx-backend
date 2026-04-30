import { Router } from 'express';
import {
  generateReport,
  getReportById,
  getReportHistory,
  runReportsSeed,
} from './report.controller';

const router = Router();

router.post('/seed/run', runReportsSeed);
router.post('/generate', generateReport);
router.get('/history', getReportHistory);
router.get('/:id', getReportById);

export default router;