const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

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

// create reservation (authenticated users only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const body = req.body || {};
    // prefer user info from token when available
    if (!body.customerEmail && req.user && req.user.email) body.customerEmail = req.user.email;
    const newReservation = new Reservation({ ...body, user: req.user.userId });
    await newReservation.save();
    res.json({ isOk: true, reservation: newReservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: 'Server error' });
  }
});

// list current user's reservations
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const items = await Reservation.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list reservations (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const items = await Reservation.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// update reservation (admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const id = req.params.id;
    const updated = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ isOk: true, reservation: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: 'Server error' });
  }
});

// delete reservation (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const id = req.params.id;
    await Reservation.findByIdAndDelete(id);
    res.json({ isOk: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isOk: false, error: 'Server error' });
  }
});

module.exports = router;
