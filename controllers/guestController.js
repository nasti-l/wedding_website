const { addGuest, getAllGuests, deleteGuestById, markGuestAsInvited, getGuestById } = require("../models/guestModel");
const { sendWhatsAppMessage } = require("../utils/whatsappSender");

const inviteGuest = async (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    if (isNaN(guestId)) return res.status(400).json({ error: "Invalid ID" });

    const guest = await markGuestAsInvited(guestId);
    if (!guest) return res.status(404).json({ error: "Guest not found" });

    const message = `Hi ${guest.name}, you are invited to our wedding! 🎉`;
    const sent = await sendWhatsAppMessage(guest.phone, message);

    if (!sent) return res.status(500).json({ error: "Failed to send WhatsApp message" });

    res.json({ message: "Guest invited successfully" });
  } catch (error) {
    console.error("Error inviting guest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const createGuest = async (req, res) => {
  try {
    const { name, phone, groupIds, primaryGroupId } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({ error: "At least one group must be specified" });
    }
    if (!primaryGroupId || !groupIds.includes(primaryGroupId)) {
      return res.status(400).json({ error: "Primary group must be in group list" });
    }

    const newGuest = await addGuest(name, phone, groupIds, primaryGroupId);
    return res.status(201).json({ message: "Guest added successfully", guest: newGuest });
  } catch (error) {
    console.error("Error adding guest:", error);
    return res.status(500).json({ error: "Failed to add guest", message: error.message });
  }
};

const getGuests = async (req, res) => {
  try {
    const guests = await getAllGuests();
    res.json(guests);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: "Failed to retrieve guests" });
  }
};

const removeGuest = async (req, res) => {
  try {
    const guestId = parseInt(req.params.id);
    if (isNaN(guestId)) return res.status(400).json({ error: "Invalid guest ID" });

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

const fetchGuestById = async (req, res) => {
  const guestId = parseInt(req.params.id);
  if (isNaN(guestId)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const guest = await getGuestById(guestId);
    if (!guest) return res.status(404).json({ error: "Guest not found" });

    res.json(guest);
  } catch (error) {
    console.error("Error fetching guest:", error);
    res.status(500).json({ error: "Failed to fetch guest" });
  }
};

module.exports = {
  createGuest,
  getGuests,
  removeGuest,
  inviteGuest,
  fetchGuestById, // ← export the clean one
};