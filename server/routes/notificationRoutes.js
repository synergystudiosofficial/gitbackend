const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification
router.post('/', auth, async (req, res) => {
  try {
    const { title, message, type, category, link, metadata } = req.body;
    const notification = new Notification({
      title,
      message,
      type,
      category,
      link,
      metadata,
      userId: req.user.id,
    });
    await notification.save();
    res.status(201).json({ notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;