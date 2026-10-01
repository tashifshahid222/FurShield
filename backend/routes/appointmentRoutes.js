import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailability,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/availability', protect, getAvailability);

router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;