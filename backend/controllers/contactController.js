import asyncHandler from '../middleware/asyncHandler.js';
import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required' });
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject: subject || '',
    message,
    status: 'new',
  });

  res.status(201).json({ success: true, message: 'Message sent successfully. We will get back to you soon.', data: contactMessage });
});

export const getContactMessages = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: messages });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  const { status } = req.body;
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  message.status = status;
  await message.save();

  res.status(200).json({ success: true, message: 'Message status updated', data: message });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  res.status(200).json({ success: true, message: 'Message deleted' });
});