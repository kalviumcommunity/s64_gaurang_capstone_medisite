// models/Disease.js
const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  commonSymptoms: [String], // e.g., ["Fever", "Cough"]
  treatment: String,
  urgencyLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
  specialist: String,
  matchPercentage: Number,
});

module.exports = mongoose.model('Disease', diseaseSchema);



// const mongoose = require('mongoose');

// const diseaseSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   causes: String,
//   treatment: String,
// });

// module.exports = mongoose.model('Disease', diseaseSchema);
