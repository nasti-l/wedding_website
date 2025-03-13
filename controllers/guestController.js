const { addGuest, getAllGuests, deleteGuestById } = require('../models/guestModel');

// Business logic for adding a guest
const createGuest = (req, res) => {
  const { name, phone, groups, primaryGroup } = req.body;

  // Basic validation
  if (!name || !phone || !groups || groups.length === 0) {
    return res.status(400).send({ error: 'Name, phone, and at least one group are required!' });
  }

  const newGuest = addGuest(name, phone, groups, primaryGroup);
  console.log(`Guest added: ${JSON.stringify(newGuest)}`);
  res.status(201).send({ message: 'Guest added successfully', guest: newGuest });
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
