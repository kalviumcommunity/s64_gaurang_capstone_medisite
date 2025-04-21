// models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String, // Allopathy / Ayurveda / Homeopathy
  uses: String,
  available: { type: Boolean, default: true },
  dosage: String,
  sideEffects: [String],
});

module.exports = mongoose.model('Medicine', medicineSchema);


// const mongoose = require('mongoose');

// const medicineSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['Allopathy', 'Ayurveda'],
//     required: true,
//   },
//   uses: String,
// });

// module.exports = mongoose.model('Medicine', medicineSchema);
