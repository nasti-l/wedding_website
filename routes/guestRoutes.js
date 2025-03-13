const express = require('express');
const { createGuest, getGuests, removeGuest } = require('../controllers/guestController');

const router = express.Router();

// Define guest-related API routes
router.post('/', createGuest);  // Add a guest
router.get('/', getGuests);     // Get all guests
router.delete('/:id', removeGuest); // Delete a guest by ID

module.exports = router;
