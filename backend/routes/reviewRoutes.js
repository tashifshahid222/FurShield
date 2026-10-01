import express from 'express';
import {
  getReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, createReview);

router.use(protect);

router.get('/manage/all', authorize('admin'), getAllReviews);
router.put('/manage/:id', authorize('admin'), updateReviewStatus);

router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;