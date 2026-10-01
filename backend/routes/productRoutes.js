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
<<<<<<< HEAD
import { upload, verifyImageUpload } from '../middleware/upload.js';
=======
import { upload } from '../middleware/upload.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.use(protect);
router.use(authorize('admin'));

<<<<<<< HEAD
router.post('/', upload.single('image'), verifyImageUpload, createProduct);
router.put('/:id', upload.single('image'), verifyImageUpload, updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/toggle', toggleProductStatus);

router.post('/categories', upload.single('image'), verifyImageUpload, createCategory);
router.put('/categories/:id', upload.single('image'), verifyImageUpload, updateCategory);
=======
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/toggle', toggleProductStatus);

router.post('/categories', upload.single('image'), createCategory);
router.put('/categories/:id', upload.single('image'), updateCategory);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id/toggle', toggleCategoryStatus);
router.get('/categories/:id', getCategoryById);

export default router;