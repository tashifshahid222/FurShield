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
<<<<<<< HEAD
import { protect, authorize, optionalProtect } from '../middleware/auth.js';
import { upload, verifyImageUpload } from '../middleware/upload.js';
=======
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

const router = express.Router();

router.get('/', getListings);
<<<<<<< HEAD
router.get('/:id', optionalProtect, getListingById);
=======
router.get('/:id', getListingById);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

router.use(protect);

router.get('/mine/shelter', authorize('shelter'), getMyShelterListings);
<<<<<<< HEAD
router.post('/', authorize('shelter', 'admin'), upload.array('images', 6), verifyImageUpload, createListing);
=======
router.post('/', authorize('shelter', 'admin'), upload.array('images', 6), createListing);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.post('/:id/interest', submitInterest);
router.put('/:id/care', authorize('shelter', 'admin'), addCareRecord);
router.put('/:id/interest', authorize('shelter', 'admin'), updateInterest);
router.put('/:id/adopted', authorize('shelter', 'admin'), markAdopted);
<<<<<<< HEAD
router.put('/:id', authorize('shelter', 'admin'), upload.array('images', 6), verifyImageUpload, updateListing);
=======
router.put('/:id', authorize('shelter', 'admin'), upload.array('images', 6), updateListing);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.delete('/:id', authorize('shelter', 'admin'), deleteListing);

export default router;