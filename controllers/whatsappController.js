const { getGuestById } = require("../models/guestModel");
const { openManualWhatsAppChat } = require("../utils/whatsappSender");

const getManualWhatsAppLink = async (req, res) => {
    try {
        const guestId = parseInt(req.params.id);
        const guest = await getGuestById(guestId);
        if (!guest) return res.status(404).json({ error: "Guest not found" });

        const message = `Hi ${guest.name}, `;
        const url = openManualWhatsAppChat(guest.phone, message);

        res.json({ url });
    } catch (error) {
        console.error("Error generating WhatsApp link:", error.message);
        res.status(500).json({ error: "Failed to generate WhatsApp link" });
    }
};

module.exports = { getManualWhatsAppLink };
