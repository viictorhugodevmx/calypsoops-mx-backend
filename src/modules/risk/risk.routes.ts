import { Router } from 'express';
import {
  getRiskBreaches,
  getRiskExposure,
  getRiskLimits,
  runRiskSeed,
} from './risk.controller';

const router = Router();

router.post('/seed/run', runRiskSeed);
router.get('/limits', getRiskLimits);
router.get('/exposure', getRiskExposure);
router.get('/breaches', getRiskBreaches);

export default router;