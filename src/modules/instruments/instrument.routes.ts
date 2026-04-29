import { Router } from 'express';
import {
  getInstruments,
  getInstrumentById,
  runInstrumentsSeed,
} from './instrument.controller';

const router = Router();

router.get('/', getInstruments);
router.get('/:id', getInstrumentById);
router.post('/seed/run', runInstrumentsSeed);

export default router;