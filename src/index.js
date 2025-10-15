require('dotenv').config();
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const moment = require('moment-timezone');

const url = process.env.URL;
console.log(url);
const name = "kee";
const radio = "Check in";

async function fillForm() {
  // Update date to today in MM/DD/YYYY format
  const date = moment().tz("Asia/Singapore").format("MM/DD/YYYY");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  // Fill text input
  await page.waitForSelector("input[aria-label='Single line text']");
  await page.type("input[aria-label='Single line text']", name);

  // Click radio button
  await page.click(`input[type='radio'][value='${radio}']`);

  // Fill date
  await page.type("input[aria-label='Date picker']", date);

  // Click submit
  await page.click("button[data-automation-id='submitButton']");
  console.log(`Form submitted for ${date}`);

  // Wait a few seconds before closing
  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
}


// --- Schedule task at 9:30 AM Singapore time daily ---
cron.schedule('44 19 * * *', () => {
  console.log('Running daily form submission...');
  fillForm().catch(err => console.error(err));
}, {
  timezone: "Asia/Singapore"
});

console.log("Scheduler running. Form will be submitted daily at 09:30 SGT.");
