const express = require('express');
const path = require('path');
const app = express();
const port = 80;

let currentTower = null; // Store the current connected tower

// Serve frontend files
app.use(express.static(path.join(__dirname)));

// API to update the current connected tower
app.use(express.json());
app.post('/tower', (req, res) => {
  const { tower } = req.body;
  if (tower) {
    currentTower = tower;
    console.log(`Updated tower: ${currentTower}`);
    res.json({ message: 'Tower updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid request, tower name is required' });
  }
});

// API to get the current connected tower
app.get('/tower', (req, res) => {
  if (currentTower) {
    res.json({ tower: currentTower });
  } else {
    res.status(404).json({ message: 'No tower connected' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`AMF Backend listening at http://localhost:${port}`);
});
