const express = require("express");
const { getManualWhatsAppLink } = require("../controllers/whatsappController");

const router = express.Router();

router.get("/:id/whatsapp-link", getManualWhatsAppLink);

module.exports = router;
