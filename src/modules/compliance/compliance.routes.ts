import { Router } from 'express';
import {
  getComplianceLogById,
  getComplianceLogs,
  getComplianceRules,
  runComplianceSeed,
} from './compliance.controller';

const router = Router();

router.post('/seed/run', runComplianceSeed);
router.get('/logs', getComplianceLogs);
router.get('/logs/:id', getComplianceLogById);
router.get('/rules', getComplianceRules);

export default router;