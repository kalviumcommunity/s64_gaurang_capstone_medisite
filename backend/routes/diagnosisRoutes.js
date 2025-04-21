const express = require('express');
const router = express.Router();
const Diagnosis = require('../models/diagnosis');

// POST a diagnosis result
router.post('/', async (req, res) => {
  try {
    const diagnosis = new Diagnosis(req.body);
    await diagnosis.save();
    res.status(201).json(diagnosis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all diagnosis history
router.get('/', async (req, res) => {
  const history = await Diagnosis.find().populate('userId');
  res.json(history);
});

module.exports = router;
