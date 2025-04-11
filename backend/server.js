
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';


app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});


app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
