const express = require('express');
const router = express.Router();
const EnterpriseClient = require('../models/EnterpriseClient');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await EnterpriseClient.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await EnterpriseClient.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get children by parent ID
router.get('/children/:parentId', async (req, res) => {
  try {
    const children = await EnterpriseClient.find({ parentId: req.params.parentId });
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new client
router.post('/', async (req, res) => {
  const client = new EnterpriseClient(req.body);
  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await EnterpriseClient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await EnterpriseClient.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;