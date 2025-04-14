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
        const browser = await puppeteer.launch({
            headless: true, // Change to false for opened browser
            userDataDir: "./whatsapp-session",
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const resource = req.resourceType();
            if (["image", "stylesheet", "font"].includes(resource)) {
                req.abort();
            } else {
                req.continue();
            }
        });// Remove for opened browser

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
        );

        const url = `https://web.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(message)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector("[aria-label='Type a message']", { timeout: 10000 });
        await page.keyboard.press("Enter");

        await new Promise(res => setTimeout(res, 1000));
        await browser.close();

        console.log(`✅ Message sent to ${formatted}`);
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
