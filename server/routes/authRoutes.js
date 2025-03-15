const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Add login logic here
    res.json({ token: 'test-token' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;