import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ owner: req.user._id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ owner: req.user._id, items: [] });
  }

  const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(200).json({ success: true, data: cart, totalAmount });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Product and valid quantity are required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (product.status !== 'active') {
    return res.status(400).json({ success: false, message: 'Product is not available' });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
  }

  let cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    cart = await Cart.create({ owner: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
    if (cart.items[existingIndex].quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Cannot exceed available stock' });
    }
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  const populated = await cart.populate('items.product');
  const totalAmount = populated.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(200).json({ success: true, message: 'Item added to cart', data: populated, totalAmount });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const index = cart.items.findIndex((i) => i.product.toString() === productId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not in cart' });
  }

  if (quantity < 1) {
    cart.items.splice(index, 1);
  } else {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items in stock` });
    }
    cart.items[index].quantity = quantity;
    cart.items[index].price = product.price;
  }

  await cart.save();
  const populated = await cart.populate('items.product');
  const totalAmount = populated.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(200).json({ success: true, message: 'Cart updated', data: populated, totalAmount });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  const populated = await cart.populate('items.product');
  const totalAmount = populated.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(200).json({ success: true, message: 'Item removed from cart', data: populated, totalAmount });
});

export const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({ success: true, message: 'Cart cleared', data: cart, totalAmount: 0 });
});