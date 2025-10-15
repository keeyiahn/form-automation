const puppeteer = require('puppeteer');
const moment = require('moment-timezone');

const url = process.env.URL;
const name = process.env.NAME;
const radio = "Check in";


async function fillForm() {
  // Update date
  const date = moment().tz("Asia/Singapore").format("DD/MM/YYYY");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
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

  await page.evaluate((date) => {
    const el = document.querySelector("input[aria-label='Date picker']");
    el.value = date;  // sets the value directly
    el.dispatchEvent(new Event('input', { bubbles: true })); // trigger change
  }, date);  

  // Click submit
  await page.click("button[data-automation-id='submitButton']");
  console.log(`Form submitted`);

  await browser.close();
}

fillForm();
