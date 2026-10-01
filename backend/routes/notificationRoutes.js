import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
  createSystemNotification,
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.delete('/:id', deleteNotification);
router.post('/send', authorize('admin'), createSystemNotification);

export default router;