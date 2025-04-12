const express = require('express');
const router = express.Router();

// Sample data – you can replace with MongoDB later
const medicines = [
  { id: 1, name: "Paracetamol", type: "Allopathy", uses: "Fever, pain relief" },
  { id: 2, name: "Ashwagandha", type: "Ayurveda", uses: "Stress, stamina" },
];

// GET all medicines
router.get('/medicines', (req, res) => {
  res.status(200).json(medicines);
});

// GET a medicine by name
router.get('/medicines/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const result = medicines.find(m => m.name.toLowerCase() === name);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
});

module.exports = router;
