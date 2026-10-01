import asyncHandler from '../middleware/asyncHandler.js';
import Notification from '../models/Notification.js';
import { paginate, buildPaginationResult } from '../utils/helpers.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, type, unreadOnly } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = { recipient: req.user._id };
  if (type) query.type = type;
  if (unreadOnly === 'true') query.isRead = false;

  const total = await Notification.countDocuments(query);
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json({ success: true, unreadCount, ...buildPaginationResult(total, pageNum, limitNum, notifications) });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
  res.status(200).json({ success: true, unreadCount });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  if (notification.recipient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  if (notification.recipient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await notification.deleteOne();
  res.status(200).json({ success: true, message: 'Notification deleted' });
});

export const createSystemNotification = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only administrators can broadcast notifications' });
  }

  const { recipient, title, message, type, link } = req.body;

  if (!recipient || !title || !message) {
    return res.status(400).json({ success: false, message: 'recipient, title and message are required' });
  }

  const notification = await Notification.create({
    recipient,
    sender: req.user._id,
    type: type || 'system',
    title,
    message,
    link: link || '',
  });

  res.status(201).json({ success: true, message: 'Notification sent', data: notification });
});