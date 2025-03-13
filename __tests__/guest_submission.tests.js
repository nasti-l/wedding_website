const puppeteer = require('puppeteer');
const { faker } = require('@faker-js/faker');

describe('Wedding Admin Panel Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 50, // Slight delay to prevent DOM-related race conditions
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Add a guest with random data', async () => {
    // Navigate to the admin page
    await page.goto('http://localhost:3000/admin'); // Update with the correct URL

    // Generate random guest data
    const randomGuest = {
      name: faker.name.findName(), // Generate a random name
      phone: faker.phone.number('+1-###-###-####'), // Generate a random phone number
    };

    // Fill in the form fields
    await page.type('#name', randomGuest.name); // Fill name
    await page.type('#phone', randomGuest.phone); // Fill phone number

    // Submit the form
    await page.click('#guestForm button[type="submit"]');

    // Wait for the API response and the DOM update
    await page.waitForResponse((response) =>
        response.url().includes('/api/guests') && response.status() === 201
    );
    await page.waitForSelector('#result'); // Ensure the success message selector appears

    // Retrieve and assert the success message
    const successMessage = await page.$eval('#result', (el) => el.textContent.trim());
    console.log('Success Message:', successMessage); // Debugging output
    expect(successMessage).toContain('Guest added successfully'); // Assert success
  });
});