const express = require('express');
const router = express.Router();
const Symptom = require('../models/symptom');

// POST a new symptom
router.post('/', async (req, res) => {
  try {
    const symptom = new Symptom(req.body);
    await symptom.save();
    res.status(201).json(symptom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all symptoms
router.get('/', async (req, res) => {
  const symptoms = await Symptom.find();
  res.json(symptoms);
});

module.exports = router;
