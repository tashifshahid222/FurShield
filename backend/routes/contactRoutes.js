import express from 'express';
import { submitContactMessage, getContactMessages, updateContactStatus, deleteContactMessage } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', contactLimiter, submitContactMessage);

router.use(protect);
router.get('/', authorize('admin'), getContactMessages);
router.put('/:id/status', authorize('admin'), updateContactStatus);
router.delete('/:id', authorize('admin'), deleteContactMessage);

export default router;