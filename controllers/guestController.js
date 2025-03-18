const { addGuest, getAllGuests, deleteGuestById } = require('../models/guestModel');

// Business logic for adding a guest
const createGuest = async (req, res) => {
  try {
    const { name, phone, groups, primaryGroup } = req.body;

    // Detailed validation with specific error messages
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!groups || !Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ error: 'At least one group must be specified' });
    }

    if (primaryGroup && !groups.includes(primaryGroup)) {
      return res.status(400).json({
        error: 'Primary group must be included in the groups array',
        groups: groups,
        primaryGroup: primaryGroup
      });
    }

    // Try to add the guest and handle errors properly
    const newGuest = await addGuest(name, phone, groups, primaryGroup);

    console.log(`Guest added: ${JSON.stringify(newGuest)}`);
    return res.status(201).json({ message: 'Guest added successfully', guest: newGuest });
  } catch (error) {
    console.error('Error adding guest:', error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "A guest with this phone number already exists" });
    }

    // Generic error if we don't recognize the specific error
    return res.status(500).json({
      error: 'Failed to add guest',
      message: error.message || 'Unknown error'
    });
  }
};

// Business logic for getting all guests
const getGuests = async (req, res) => {
  try {
    const guests = await getAllGuests();
    res.json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: "Failed to retrieve guests" });
  }
};

// Business logic for deleting a guest by ID
const removeGuest = async (req, res) => {
  try {
    const guestId = parseInt(req.params.id);

    if (isNaN(guestId)) {
      return res.status(400).json({ error: "Invalid guest ID" });
    }

    const success = await deleteGuestById(guestId);
    if (success) {
      return res.json({ message: "Guest deleted successfully!" });
    } else {
      return res.status(404).json({ error: "Guest not found" });
    }
  } catch (error) {
    console.error("Error deleting guest:", error);
    return res.status(500).json({ error: "Failed to delete guest" });
  }
};

module.exports = { createGuest, getGuests, removeGuest };
