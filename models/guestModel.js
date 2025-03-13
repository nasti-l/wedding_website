// In-memory "guest list" storage
let guestList = [];

const addGuest = (name, phone) => {
  const newGuest = { id: guestList.length + 1, name, phone };
  guestList.push(newGuest);
  return newGuest;
};

const getAllGuests = () => guestList;

const deleteGuestById = (id) => {
  const initialLength = guestList.length;
  guestList = guestList.filter((guest) => guest.id !== id);
  return guestList.length < initialLength;
};

module.exports = { addGuest, getAllGuests, deleteGuestById };
