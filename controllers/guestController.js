const { addGuest, getAllGuests, deleteGuestById } = require('../models/guestModel');

// Business logic for adding a guest
const createGuest = (req, res) => {
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

    // Try to add the guest and catch any errors from the addGuest function
    const newGuest = addGuest(name, phone, groups, primaryGroup);

    console.log(`Guest added: ${JSON.stringify(newGuest)}`);
    return res.status(201).json({ message: 'Guest added successfully', guest: newGuest });
  } catch (error) {
    console.error('Error adding guest:', error);

    // Provide specific error message based on error type
    if (error.code === 'DUPLICATE_PHONE') {
      return res.status(409).json({ error: 'A guest with this phone number already exists' });
    } else if (error.code === 'INVALID_GROUP') {
      return res.status(400).json({ error: `Invalid group: ${error.group}` });
    } else if (error.code === 'DATABASE_ERROR') {
      return res.status(500).json({ error: 'Database error occurred' });
    }

    // Generic error if we don't recognize the specific error
    return res.status(500).json({
      error: 'Failed to add guest',
      message: error.message || 'Unknown error'
    });
  }
};

// Business logic for getting all guests
const getGuests = (req, res) => {
  res.send(getAllGuests());
};

// Business logic for deleting a guest by ID
const removeGuest = (req, res) => {
  const guestId = parseInt(req.params.id);

  if (deleteGuestById(guestId)) {
    res.send({ message: 'Guest deleted successfully!' });
  } else {
    res.status(404).send({ error: 'Guest not found' });
  }
};

module.exports = { createGuest, getGuests, removeGuest };
