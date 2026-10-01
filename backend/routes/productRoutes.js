import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../controllers/productController.js';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, verifyImageUpload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.single('image'), verifyImageUpload, createProduct);
router.put('/:id', upload.single('image'), verifyImageUpload, updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/toggle', toggleProductStatus);

router.post('/categories', upload.single('image'), verifyImageUpload, createCategory);
router.put('/categories/:id', upload.single('image'), verifyImageUpload, updateCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id/toggle', toggleCategoryStatus);
router.get('/categories/:id', getCategoryById);

export default router;