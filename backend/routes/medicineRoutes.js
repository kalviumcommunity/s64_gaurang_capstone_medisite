const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

// POST a new medicine
router.post('/', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all medicines
router.get('/', async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
});

// PUT update a medicine
router.put('/:id', async (req, res) => {
  try {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
