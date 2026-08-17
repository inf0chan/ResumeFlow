const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { user } = require('../models');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, photo: u.photo };
}

// GET /api/users/me — profile for the avatar menu / "Hi <name>" header
router.get('/me', async (req, res) => {
  const found = await user.findByPk(req.userId);
  if (!found) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: publicUser(found) });
});

// PATCH /api/users/me — used by the "Profile" screen
router.patch('/me', async (req, res) => {
  const { name, email, photo } = req.body;
  const found = await user.findByPk(req.userId);
  if (!found) return res.status(404).json({ success: false, message: 'User not found' });

  if (name !== undefined) found.name = name;
  if (email !== undefined) found.email = email;
  if (photo !== undefined) found.photo = photo;
  await found.save();

  res.json({ success: true, user: publicUser(found) });
});

// PATCH /api/users/me/password — "Change password" avatar-menu item
router.patch('/me/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' });
  }

  const found = await user.findByPk(req.userId);
  if (!found) return res.status(404).json({ success: false, message: 'User not found' });

  const match = await bcrypt.compare(currentPassword, found.password);
  if (!match) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

  found.password = await bcrypt.hash(newPassword, 10);
  await found.save();

  res.json({ success: true, message: 'Password updated' });
});

module.exports = router;
