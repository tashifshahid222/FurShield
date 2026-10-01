import express from 'express';
import {
  getAdminStats,
  getOwnerDashboard,
  getVetDashboard,
  getShelterDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminStats);
router.get('/owner', authorize('owner'), getOwnerDashboard);
router.get('/veterinarian', authorize('veterinarian'), getVetDashboard);
router.get('/shelter', authorize('shelter'), getShelterDashboard);

export default router;