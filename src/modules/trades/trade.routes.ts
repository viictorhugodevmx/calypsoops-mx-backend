import { Router } from 'express';
import {
  getTrades,
  getTradeById,
  runTradesSeed,
  updateTradeStatus,
} from './trade.controller';

const router = Router();

router.get('/', getTrades);
router.post('/seed/run', runTradesSeed);
router.get('/:id', getTradeById);
router.patch('/:id/status', updateTradeStatus);

export default router;