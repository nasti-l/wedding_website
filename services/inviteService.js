const { markGuestAsInvited } = require("../models/guestModel");
const { sendWhatsAppMessage } = require("../utils/whatsappSender");

const inviteAndNotifyGuest = async (guestId) => {
    try {
        const guest = await markGuestAsInvited(guestId);
        if (!guest) {
            return { success: false, status: 404, error: "Guest not found" };
        }

        const message = `Hi ${guest.name}, you are invited to our wedding! 🎉`;
        const sent = await sendWhatsAppMessage(guest.phone, message);

        if (!sent) {
            return { success: false, status: 500, error: "Failed to send WhatsApp message" };
        }

        return { success: true };
    } catch (err) {
        console.error("Error in inviteAndNotifyGuest:", err.message);
        return { success: false, status: 500, error: "Unexpected failure" };
    }
};

module.exports = { inviteAndNotifyGuest };
