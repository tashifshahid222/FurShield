import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
  getPublicVeterinarians,
  getPublicVeterinarianById,
  getPublicShelters,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/veterinarians/public', getPublicVeterinarians);
router.get('/veterinarians/public/:id', getPublicVeterinarianById);
router.get('/shelters/public', getPublicShelters);

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.put('/:id/deactivate', authorize('admin'), deactivateUser);
router.put('/:id/activate', authorize('admin'), activateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;