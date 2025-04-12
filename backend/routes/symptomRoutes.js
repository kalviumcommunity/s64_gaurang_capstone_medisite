const express = require('express');
const router = express.Router();

// Sample data – you can replace with MongoDB later
let medicines = [
  { id: 1, name: "Paracetamol", type: "Allopathy", uses: "Fever, pain relief" },
  { id: 2, name: "Ashwagandha", type: "Ayurveda", uses: "Stress, stamina" },
];

// ✅ GET all medicines
router.get('/', (req, res) => {
  res.status(200).json(medicines);
});

// ✅ GET a medicine by name
router.get('/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  const result = medicines.find(m => m.name.toLowerCase() === name);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Medicine not found" });
  }
});

// ✅ POST a new medicine
router.post('/', (req, res) => {
  const { name, type, uses } = req.body;

  if (!name || !type || !uses) {
    return res.status(400).json({ message: "Name, type, and uses are required" });
  }

  const newMedicine = {
    id: medicines.length + 1,
    name,
    type,
    uses
  };

  medicines.push(newMedicine);

  res.status(201).json({
    message: "Medicine added successfully",
    data: newMedicine
  });
});

module.exports = router;
