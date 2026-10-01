import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  addCareRecord,
  submitInterest,
  updateInterest,
  markAdopted,
  getMyShelterListings,
} from '../controllers/adoptionController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { upload, verifyImageUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', optionalProtect, getListingById);

router.use(protect);

router.get('/mine/shelter', authorize('shelter'), getMyShelterListings);
router.post('/', authorize('shelter', 'admin'), upload.array('images', 6), verifyImageUpload, createListing);
router.post('/:id/interest', submitInterest);
router.put('/:id/care', authorize('shelter', 'admin'), addCareRecord);
router.put('/:id/interest', authorize('shelter', 'admin'), updateInterest);
router.put('/:id/adopted', authorize('shelter', 'admin'), markAdopted);
router.put('/:id', authorize('shelter', 'admin'), upload.array('images', 6), verifyImageUpload, updateListing);
router.delete('/:id', authorize('shelter', 'admin'), deleteListing);

export default router;