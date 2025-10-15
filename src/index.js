const puppeteer = require('puppeteer');
const moment = require('moment-timezone');

const url = process.env.URL;
const name = process.env.NAME;
const radio = "Check in";
const date = moment().tz("Asia/Singapore").format("DD/MM/YYYY");

async function fillForm() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox",
      "--lang=en-US"
    ],
    env: {
      TZ: "America/New_York"
    }
  });
  
  const page = await browser.newPage();
  await page.goto(url);

  // Fill text input
  await page.waitForSelector("input[aria-label='Single line text']");
  await page.type("input[aria-label='Single line text']", name);
  console.log("Name: " + name);

  // Click radio button
  await page.click(`input[type='radio'][value='${radio}']`);
  console.log("Radio: " + radio);

  // Fill date input
  await page.type("input[aria-label='Date picker']", date);
  console.log("Date: " + date);

  // Click submit
  await page.click("button[data-automation-id='submitButton']");
  console.log(`Form submitted`);

  // await new Promise(resolve => setTimeout(resolve, 3000)); // wait for 3 seconds
  await browser.close();
}

fillForm();
