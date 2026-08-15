const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { user } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

function signToken(u) {
  return jwt.sign({ id: u.id, email: u.email }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, photo: u.photo };
}

router.post('/register', async function (req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    }

    // password is hashed automatically by the beforeCreate hook on the model
    const created = await user.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Account created',
      token: signToken(created),
      user: publicUser(created),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const found = await user.findOne({ where: { email } });
    if (!found) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Logged in',
      token: signToken(found),
      user: publicUser(found),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
});

// Stubs kept for the routes with no email infrastructure wired up yet.
router.post('/forget-password', function (req, res) {
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

router.post('/reset-password', function (req, res) {
  res.json({ success: true, message: 'Password reset route — wire up a reset token flow before using in production.' });
});

module.exports = router;
