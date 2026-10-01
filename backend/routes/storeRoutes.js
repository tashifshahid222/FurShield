import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/cart', getCart);
router.post('/cart/items', addToCart);
router.put('/cart/items', updateCartItem);
router.delete('/cart/items/:productId', removeFromCart);
router.delete('/cart', clearCart);

router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', authorize('admin'), updateOrderStatus);
router.put('/orders/:id/cancel', cancelOrder);

export default router;