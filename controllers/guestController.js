const { addGuest, getAllGuests, deleteGuestById } = require('../models/guestModel');

// Business logic for adding a guest
const createGuest = (req, res) => {
  const { name, phone } = req.body;

  // Basic validation
  if (!name || !phone) {
    return res.status(400).send({ error: 'Name and phone are required!' });
  }

  const newGuest = addGuest(name, phone);
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
