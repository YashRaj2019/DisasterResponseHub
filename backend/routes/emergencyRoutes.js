import express from 'express';
import {
  createEmergency,
  getEmergencies,
  updateEmergencyStatus,
  deleteEmergency
} from '../controllers/emergencyController.js';
import { protect, volunteer, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createEmergency)
  .get(getEmergencies);

router.route('/:id')
  .delete(protect, deleteEmergency);

router.route('/:id/status')
  .put(protect, volunteer, updateEmergencyStatus);

export default router;
