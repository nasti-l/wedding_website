const puppeteer = require("puppeteer");
require('dotenv').config();


const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');

    // Handle Israeli numbers (leading 0)
    if (digits.startsWith('0')) {
        return '972' + digits.slice(1); // 058... → 97258...
    }

    // Remove leading 972 if it already exists and re-add to ensure consistency
    if (digits.startsWith('972')) {
        return digits;
    }

    // Fallback: assume digits are already in international format
    return digits;
};


const sendWhatsAppMessage = async (phone, message) => {
    try {
        const formatted = formatPhoneNumber(phone);
        const url = `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;

        const browser = await puppeteer.launch({ headless: false }); // show browser for QR login
        const page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector("a[href*='send']", { timeout: 10000 });
        await page.click("a[href*='send']");

        await page.waitForSelector("._3Uu1_, ._3FRCZ", { timeout: 10000 }); // new or old selector
        await page.keyboard.press("Enter");

        console.log(`✅ Sent to ${formatted}`);
        await browser.close();

        return true;
    } catch (err) {
        console.error("❌ Failed to send WhatsApp:", err.message);
        return false;
    }
};

const openManualWhatsAppChat = (phone, message) => {
    const formatted = formatPhoneNumber(phone);
    return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
};

module.exports = { sendWhatsAppMessage, openManualWhatsAppChat };
