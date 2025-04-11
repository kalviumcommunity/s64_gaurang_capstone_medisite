require('dotenv').config();
const express = require('express');
const app = express();

// Use the PORT from environment (Render provides it)
const PORT = process.env.PORT || 3000;

// Listen on 0.0.0.0 instead of localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});
