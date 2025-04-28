const express = require('express');
const router = express.Router();
const Disease = require('../models/disease');


router.post('/', async (req, res) => {
  try {
    const disease = new Disease(req.body);
    await disease.save();
    res.status(201).json(disease);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all diseases
router.get('/', async (req, res) => {
  const diseases = await Disease.find();
  res.json(diseases);
});

module.exports = router;
