const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  
  const token = auth.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: data.userId,
      role: data.role,
      email: data.email
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ 
      token, 
      role: user.role, 
      email: user.email,
      userId: user._id.toString(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// register new user
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ 
      email: email.toLowerCase(), 
      passwordHash: hash, 
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'user' 
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ 
      token, 
      role: user.role, 
      email: user.email,
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// simple protected route to check token
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    const data = jwt.verify(token, JWT_SECRET);
    res.json({ email: data.email, role: data.role });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
