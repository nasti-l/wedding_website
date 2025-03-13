const express = require('express');
const path = require('path');

const router = express.Router();

// Serve the admin page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html')); // Serve the admin page
});

module.exports = router;
