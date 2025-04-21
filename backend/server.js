// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const symptomRoutes = require('./routes/symptomRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/symptoms', symptomRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('🚀 Server is running - Medicine Library API');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
