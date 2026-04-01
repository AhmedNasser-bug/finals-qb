const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.waitForTimeout(2000); // Give the app a moment to render

  // Try taking screenshot
  await page.screenshot({ path: 'onboarding_final.png', fullPage: true });

  await browser.close();
})();
