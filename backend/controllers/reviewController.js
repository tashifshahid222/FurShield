import asyncHandler from '../middleware/asyncHandler.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { paginate, buildPaginationResult } from '../utils/helpers.js';

export const getReviews = asyncHandler(async (req, res) => {
  const { targetType, target, page, limit } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = { status: 'approved' };
  if (targetType) query.targetType = targetType;
  if (target) query.target = target;

  const total = await Review.countDocuments(query);
  const reviews = await Review.find(query)
    .populate('author', 'name profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, reviews) });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (status) query.status = status;

  const total = await Review.countDocuments(query);
  const reviews = await Review.find(query)
    .populate('author', 'name email')
    .populate('target', 'name shelterProfile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const enriched = reviews.map((r) => {
    const doc = r.toObject();
    doc.targetName =
      r.targetType === 'product'
        ? r.target?.name || ''
        : r.target?.shelterProfile?.name || r.target?.name || '';
    return doc;
  });

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, enriched) });
});

export const createReview = asyncHandler(async (req, res) => {
  const { targetType, target, rating, comment } = req.body;

  if (!targetType || !target || !rating) {
    return res.status(400).json({ success: false, message: 'targetType, target and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const validTypes = ['veterinarian', 'shelter', 'product'];
  if (!validTypes.includes(targetType)) {
    return res.status(400).json({ success: false, message: 'Invalid review target type' });
  }

  if (targetType === 'product') {
    const product = await Product.findById(target);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } else {
    const user = await User.findById(target);
    if (!user || user.role !== (targetType === 'veterinarian' ? 'veterinarian' : 'shelter')) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }
  }

  const existing = await Review.findOne({ author: req.user._id, target, targetType });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this item' });
  }

  const review = await Review.create({
    rating,
    comment: comment || '',
    author: req.user._id,
    targetType,
    target,
    targetModel: targetType === 'product' ? 'Product' : 'User',
    status: 'approved',
  });

  if (targetType === 'product') {
    await Product.refreshRating(target);
  }

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
  }

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  await review.save();

  if (review.targetType === 'product') {
    await Product.refreshRating(review.target);
  }

  res.status(200).json({ success: true, message: 'Review updated', data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  const isAuthor = review.author.toString() === req.user._id.toString();
  if (!isAuthor && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
  }

  const { target, targetType } = review;
  await review.deleteOne();

  if (targetType === 'product') {
    await Product.refreshRating(target);
  }

  res.status(200).json({ success: true, message: 'Review deleted' });
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid review status' });
  }

  review.status = status;
  await review.save();

  res.status(200).json({ success: true, message: 'Review status updated', data: review });
});