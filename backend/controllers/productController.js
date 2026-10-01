import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
<<<<<<< HEAD
import { paginate, buildPaginationResult, escapeRegex, removeUpload } from '../utils/helpers.js';
=======
import { paginate, buildPaginationResult } from '../utils/helpers.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, minPrice, maxPrice, sort, minRating } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = { status: 'active' };

  if (req.query.all !== 'true') {
    query.status = 'active';
  }
  if (req.query.includeInactive === 'true') {
    delete query.status;
  }

  if (req.query.featured === 'true') query.featured = true;

  if (search) {
    query.$or = [
<<<<<<< HEAD
      { name: { $regex: escapeRegex(search), $options: 'i' } },
      { description: { $regex: escapeRegex(search), $options: 'i' } },
=======
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
    ];
  }
  if (category) query.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
    if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
  }
  if (minRating) query.rating = { $gte: parseFloat(minRating) };

  let sortQuery = {};
  switch (sort) {
    case 'price_asc':
      sortQuery = { price: 1 };
      break;
    case 'price_desc':
      sortQuery = { price: -1 };
      break;
    case 'rating':
      sortQuery = { rating: -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, products) });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const stats = await Product.refreshRating(product._id);
  if (product.rating !== stats.rating || product.ratingCount !== stats.ratingCount) {
    product.rating = stats.rating;
    product.ratingCount = stats.ratingCount;
  }

  res.status(200).json({ success: true, data: product });
});

const isFeatured = (v) => v === true || v === 'true' || v === '1';

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock, status, featured } = req.body;

  if (!name || !description || !category || price === undefined) {
    return res.status(400).json({ success: false, message: 'Name, description, category and price are required' });
  }

  const cat = await Category.findById(category);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock: stock || 0,
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || ''),
    status: status || 'active',
    featured: isFeatured(featured),
    addedBy: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Product created', data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const allowedFields = ['name', 'description', 'category', 'price', 'stock', 'status', 'featured'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = f === 'featured' ? isFeatured(req.body[f]) : req.body[f];
  });

  if (req.file) updateData.image = `/uploads/${req.file.filename}`;

<<<<<<< HEAD
  const previousImage = product.image;
=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  const updated = await Product.findByIdAndUpdate(product._id, updateData, {
    new: true,
    runValidators: true,
  });

<<<<<<< HEAD
  if (updateData.image && previousImage && previousImage !== updateData.image) {
    await removeUpload(previousImage);
  }

=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  res.status(200).json({ success: true, message: 'Product updated', data: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted' });
});

export const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  product.status = product.status === 'active' ? 'inactive' : 'active';
  await product.save();
  res.status(200).json({ success: true, message: 'Product status updated', data: product });
});