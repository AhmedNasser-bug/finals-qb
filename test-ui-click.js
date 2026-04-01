const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.waitForTimeout(2000);

  // Click Get Started
  await page.click('text=GET STARTED');

  await page.waitForTimeout(1000);

  // Try taking screenshot
  await page.screenshot({ path: 'onboarding_selector.png', fullPage: true });

  await browser.close();
})();
