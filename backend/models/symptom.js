const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

module.exports = mongoose.model('Symptom', symptomSchema);
