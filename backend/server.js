// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Import Routes
const symptomRoutes = require('./routes/symptomRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const userRoutes = require('./routes/userRoutes');
const searchHistoryRoutes = require('./routes/searchHistory');
const geminiRoutes = require('./routes/geminiRoutes');

// Use Routes
app.use('/api/symptoms', symptomRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gemini', geminiRoutes);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.DEEP_SEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DeepSeek API key not set' });
    }
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: "You are a knowledgeable medical assistant. Provide helpful information about health, symptoms, and medicines, but always remind users to consult healthcare professionals for medical advice. Keep responses concise and easy to understand."
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from DeepSeek AI' });
  }
});


// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MediVerse API' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
