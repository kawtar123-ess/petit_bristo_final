const express = require('express');
const Order = require('../models/Order');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all orders (admin only) - MUST BE BEFORE /my-orders
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you can add this check from your auth middleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    const orders = await Order.find().sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, totalPrice, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ error: 'Invalid total price' });
    }

    // Get user info from token
    const userInfo = req.user;

    // Clean items: extract only the fields we need
    const cleanedItems = items.map(item => ({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: item.price,
      quantity: item.quantity
    }));

    const order = new Order({
      userId,
      userName: userInfo.firstName + ' ' + userInfo.lastName,
      userEmail: userInfo.email,
      items: cleanedItems,
      totalPrice,
      notes: notes || '',
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
