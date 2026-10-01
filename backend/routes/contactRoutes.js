import express from 'express';
import { submitContactMessage, getContactMessages, updateContactStatus, deleteContactMessage } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
<<<<<<< HEAD
import { contactLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/', contactLimiter, submitContactMessage);
=======

const router = express.Router();

router.post('/', submitContactMessage);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

router.use(protect);
router.get('/', authorize('admin'), getContactMessages);
router.put('/:id/status', authorize('admin'), updateContactStatus);
router.delete('/:id', authorize('admin'), deleteContactMessage);

export default router;