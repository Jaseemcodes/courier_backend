const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { protect: auth } = require('../middlewares/auth');

// Get all providers
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ name: 1 });
    res.json({ success: true, count: providers.length, data: providers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Create a provider (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Provider name already exists' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update a provider (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }

    res.json({ success: true, data: provider });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Provider name already exists' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete a provider (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
