const express = require('express');
const { createGuest, getGuests, removeGuest } = require('./../controllers/guestController');
const { createGroup, getGroups } = require("../controllers/groupController");


const router = express.Router();

// Define guest-related API routes
router.post('/', createGuest);  // Add a guest
router.get('/', getGuests);     // Get all guests
router.delete('/:id', removeGuest); // Delete a guest by ID

router.post("/groups", createGroup);
router.get("/groups", getGroups);

module.exports = router;
