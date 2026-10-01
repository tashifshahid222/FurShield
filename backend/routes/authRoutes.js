import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  updateVeterinarianProfile,
  updateShelterProfile,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';
import {
  registerValidators,
  loginValidators,
  passwordValidators,
  profileValidators,
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', authLimiter, validate(registerValidators), register);
router.post('/login', authLimiter, validate(loginValidators), login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.put('/profile', protect, validate(profileValidators), updateProfile);
router.put('/password', protect, validate(passwordValidators), updatePassword);
router.put('/vet-profile', protect, authorize('veterinarian'), updateVeterinarianProfile);
router.put('/shelter-profile', protect, authorize('shelter'), updateShelterProfile);

export default router;