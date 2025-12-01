const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// public: get menu grouped by category
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: 1 });
    // group
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = { title: item.category, items: [] };
      acc[item.category].items.push({ name: item.name, description: item.description, price: item.price });
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// admin: add menu item
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const item = new MenuItem(req.body);
    await item.save();
    res.json({ isOk: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: 'Server error' });
  }
});

module.exports = router;
