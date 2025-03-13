const puppeteer = require('puppeteer');
const { server } = require('./../server.js'); // Adjust the path to your server.js file
const { faker } = require('@faker-js/faker');

describe('Wedding Admin Panel Tests', () => {
  let browser;
  let page;
  let port;

  beforeAll(async () => {
    // Extract the dynamic port the server is running on
    port = server.address().port;

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    // Close Puppeteer and stop the server gracefully
    await browser.close();
    server.close();
  });

  test('Add a guest with random data', async () => {
    // Navigate to the server's dynamic port
    await page.goto(`http://localhost:${port}/admin`); // Use the assigned port

    // Generate random guest data
    const randomGuest = {
      name: faker.person.fullName(),
      phone: faker.phone.number('+1-###-###-####'),
      groups: [faker.word.noun(), faker.word.noun()],
    };

    // Fill out the "Add a Guest" form
    await page.type('#name', randomGuest.name);
    await page.type('#phone', randomGuest.phone);

    // Add groups dynamically
    for (const group of randomGuest.groups) {
      await page.type('#groupInput', group);
      await page.click('.btn-add'); // Click on "Add Group"
    }

    // Set the first group as primary
    await page.click('.group-tag.primary');

    // Submit the form
    await page.click('#guestForm button[type="submit"]');

    // Check if success message appears
    await page.waitForSelector('#result');
    const successMessage = await page.$eval('#result', (el) => el.textContent);
    expect(successMessage).toContain('Guest added successfully');
  });
});