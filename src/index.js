require('dotenv').config();
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const moment = require('moment-timezone');

const url = process.env.URL;
const name = "test";
const radio = "Check in";

async function fillForm() {
  // Update date
  const date = moment().tz("Asia/Singapore").format("DD/MM/YYYY");
  console.log(date)

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

  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
}

fillForm();
