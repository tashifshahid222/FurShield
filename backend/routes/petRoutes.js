import express from 'express';
import {
  getPets,
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  addToGallery,
  removeFromGallery,
  getPetsForVet,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, verifyImageUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, getMyPets);
router.get('/vet', protect, authorize('veterinarian'), getPetsForVet);

router.get('/', protect, getPets);
router.get('/:id', protect, getPetById);
router.post('/', protect, upload.single('image'), verifyImageUpload, createPet);
router.put('/:id', protect, upload.single('image'), verifyImageUpload, updatePet);
router.delete('/:id', protect, deletePet);

router.post('/:id/gallery', protect, upload.single('image'), verifyImageUpload, addToGallery);
router.delete('/:id/gallery', protect, removeFromGallery);

export default router;