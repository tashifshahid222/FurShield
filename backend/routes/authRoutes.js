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
<<<<<<< HEAD
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
=======

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.put('/vet-profile', protect, authorize('veterinarian'), updateVeterinarianProfile);
router.put('/shelter-profile', protect, authorize('shelter'), updateShelterProfile);

export default router;