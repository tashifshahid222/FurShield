import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/Category.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.status(200).json({ success: true, data: categories });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.status(200).json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const category = await Category.create({
    name,
    description: description || '',
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || ''),
  });

  res.status(201).json({ success: true, message: 'Category created', data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.status !== undefined) updateData.status = req.body.status;
  if (req.file) updateData.image = `/uploads/${req.file.filename}`;

  const updated = await Category.findByIdAndUpdate(category._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Category updated', data: updated });
});

export const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  category.status = category.status === 'active' ? 'inactive' : 'active';
  await category.save();
  res.status(200).json({ success: true, message: 'Category status updated', data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const Product = (await import('../models/Product.js')).default;
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    return res.status(400).json({ success: false, message: `Cannot delete category with ${productCount} products. Deactivate it instead.` });
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted' });
});