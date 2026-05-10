import express from 'express';
import {
  createShelter,
  getShelters,
  updateShelterAvailability,
} from '../controllers/shelterController.js';
import { protect, admin, volunteer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createShelter)
  .get(getShelters);

router.route('/:id/availability')
  .put(protect, volunteer, updateShelterAvailability);

export default router;
