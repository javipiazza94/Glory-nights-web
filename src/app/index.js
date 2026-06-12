const express = require('express');
const app = express();
app.use(express.json());

// Mock route for promoters
app.get('/api/promoters', (req, res) => {
  // Return empty array or sample data
  res.json([]);
});

module.exports = app;
