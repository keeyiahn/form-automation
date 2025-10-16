const Telenode = require("telenode-js");
const puppeteer = require('puppeteer');
const moment = require('moment-timezone');

const bot = new Telenode({
  apiToken: process.env.API_TOKEN
});
const url = process.env.URL;
const name = process.env.NAME;
const radio = "Check in";
const channel = process.env.CHAT_ID;

async function main() {
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

  // Check date format
  const dateInput = await page.$("input[aria-label='Date picker']");
  const placeholder = await page.evaluate(el => el.placeholder, dateInput);
  console.log(placeholder);

  let date;
  if (placeholder.includes("dd/MM")) {
    // Singapore-style
    date = moment().tz("Asia/Singapore").format("DD/MM/YYYY");
  } else {
    // US-style
    date = moment().tz("Asia/Singapore").format("MM/DD/YYYY");
  }
  console.log("Date: " + date);

  // Fill date input
  await page.type("input[aria-label='Date picker']", date);

  // Click submit
  await page.click("button[data-automation-id='submitButton']");
  console.log(`Form submitted`);

  await new Promise(resolve => setTimeout(resolve, 3000)); 
  await browser.close();

  notif = `Submitting check-in form... \nName: ${name} \nRadio: ${radio} \nDate: ${date}`;

  await bot.sendTextMessage(notif, channel);
}

main();
