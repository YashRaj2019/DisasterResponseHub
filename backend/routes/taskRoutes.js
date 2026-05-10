import express from 'express';
import { assignTask, getMyTasks, updateTaskStatus } from '../controllers/taskController.js';
import { protect, admin, volunteer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, assignTask);

router.get('/my-tasks', protect, volunteer, getMyTasks);
router.put('/:id/status', protect, volunteer, updateTaskStatus);

export default router;
