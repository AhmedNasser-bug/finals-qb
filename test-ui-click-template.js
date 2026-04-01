const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.waitForTimeout(2000);

  // Click the Classical Mechanics template
  await page.click('text=Classical Mechanics');

  await page.waitForTimeout(2000);

  // Try taking screenshot
  await page.screenshot({ path: 'study_mode_selector.png', fullPage: true });

  await browser.close();
})();
