import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { paginate, buildPaginationResult, sendNotification } from '../utils/helpers.js';

export const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || product.status !== 'active') {
      return res.status(400).json({ success: false, message: `${product ? product.name : 'A product'} is no longer available` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    }

    orderItems.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    owner: req.user._id,
    items: orderItems,
    totalAmount,
    status: 'pending',
    orderDate: Date.now(),
    deliveryAddress: req.body.deliveryAddress || req.user.address || {},
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  await cart.save();

  await sendNotification({
    recipient: req.user._id,
    type: 'general',
    title: 'Order placed',
    message: `Your order for ${orderItems.length} item(s) totaling $${totalAmount.toFixed(2)} has been placed.`,
    link: '/owner/orders',
    referenceId: order._id,
  });

  res.status(201).json({ success: true, message: 'Order created successfully', data: order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const query = {};
  if (req.user.role === 'owner') {
    query.owner = req.user._id;
<<<<<<< HEAD
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to list all orders' });
=======
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4
  }
  if (status) query.status = status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('owner', 'name email')
    .populate('items.product', 'name image')
    .sort({ orderDate: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({ success: true, ...buildPaginationResult(total, pageNum, limitNum, orders) });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('owner', 'name email phone address')
    .populate('items.product', 'name image category');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.owner._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.status(200).json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only administrators can update order status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  order.status = status;
  await order.save();

  await sendNotification({
    recipient: order.owner,
    type: 'product_notification',
    title: 'Order status updated',
    message: `Your order is now ${status}.`,
    link: '/owner/orders',
    referenceId: order._id,
  });

  res.status(200).json({ success: true, message: 'Order status updated', data: order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
  }

  order.status = 'cancelled';
  await order.save();

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  res.status(200).json({ success: true, message: 'Order cancelled', data: order });
});