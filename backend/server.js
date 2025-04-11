require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const HOST = 'localhost';
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
