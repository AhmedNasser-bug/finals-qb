const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app
  await page.goto('http://localhost:3000');

  // Wait for the content to load (the template list should be there)
  await page.waitForSelector('text=Select a Subject');

  // Take a screenshot of the main onboarding view
  await page.screenshot({ path: 'onboarding_final.png', fullPage: true });

  // Now let's try to click one of the templates and check the new page route
  // We added templates, so let's find one by text (e.g. Japanese N5)
  // Our new layout has "System Templates" or just the loaded templates

  await browser.close();
})();
