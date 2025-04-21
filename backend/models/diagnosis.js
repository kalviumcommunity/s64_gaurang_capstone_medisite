// // models/Diagnosis.js
// const mongoose = require('mongoose');

// const diagnosisSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   symptoms: [String],
//   predictedDiseases: [
//     {
//       name: String,
//       match: Number,
//       urgencyLevel: String,
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Diagnosis', diagnosisSchema);




const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symptoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom',
  }],
  disease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease',
  },
  recommendedMedicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
  }],
  diagnosisDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);

