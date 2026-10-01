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
<<<<<<< HEAD
import { upload, verifyImageUpload } from '../middleware/upload.js';
=======
import { upload } from '../middleware/upload.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

const router = express.Router();

router.get('/my', protect, getMyPets);
router.get('/vet', protect, authorize('veterinarian'), getPetsForVet);

router.get('/', protect, getPets);
router.get('/:id', protect, getPetById);
<<<<<<< HEAD
router.post('/', protect, upload.single('image'), verifyImageUpload, createPet);
router.put('/:id', protect, upload.single('image'), verifyImageUpload, updatePet);
router.delete('/:id', protect, deletePet);

router.post('/:id/gallery', protect, upload.single('image'), verifyImageUpload, addToGallery);
=======
router.post('/', protect, upload.single('image'), createPet);
router.put('/:id', protect, upload.single('image'), updatePet);
router.delete('/:id', protect, deletePet);

router.post('/:id/gallery', protect, upload.single('image'), addToGallery);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.delete('/:id/gallery', protect, removeFromGallery);

export default router;