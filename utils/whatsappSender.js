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
        const url = `https://web.whatsapp.com/send?phone=${formatted}`;

        const browser = await puppeteer.launch({
            headless: true, // Change to false for opened browser
            userDataDir: "./whatsapp-session",
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2" });

        // Wait for chat box or retry if it doesn't show up
        await page.waitForSelector("[aria-label='Type a message']", { timeout: 30000 });
        const messageBox = await page.$("[aria-label='Type a message']");

        if (!messageBox) {
            throw new Error("Message input not found.");
        }

        await messageBox.click({ clickCount: 2 }); // ensure focused + selected
        await page.evaluate(() => {
            const input = document.querySelector("[aria-label='Type a message']");
            input.innerText = ''; // Clear prefill via DOM
        });
        await page.keyboard.type(message);
        await page.keyboard.press("Enter");


        // Optional confirmation wait
        await new Promise(resolve => setTimeout(resolve, 2000)); // safe delay
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
    return `https://web.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(message)}`;
};


module.exports = { sendWhatsAppMessage, openManualWhatsAppChat };
