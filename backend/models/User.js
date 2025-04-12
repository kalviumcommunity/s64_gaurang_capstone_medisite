// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  symptoms: [String], // Example: ["Fever", "Cough"]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
database read and write
