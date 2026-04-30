import { Router } from 'express';
import {
  addWorkbenchTaskComment,
  getWorkbenchTaskById,
  getWorkbenchTasks,
  runWorkbenchSeed,
  updateWorkbenchTaskStatus,
} from './workbench.controller';

const router = Router();

router.post('/seed/run', runWorkbenchSeed);
router.get('/tasks', getWorkbenchTasks);
router.get('/tasks/:id', getWorkbenchTaskById);
router.patch('/tasks/:id/status', updateWorkbenchTaskStatus);
router.post('/tasks/:id/comments', addWorkbenchTaskComment);

export default router;