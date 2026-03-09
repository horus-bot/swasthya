const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/dashboard');

  // Read localStorage
  const approved = await page.evaluate(() => localStorage.getItem('approvedAppointments'));
  console.log('approvedAppointments=', approved);

  // Try to approve the first pending appointment by simulating a click on the first Approve button
  const approveButton = await page.locator('button:has-text("Approve")').first();
  if (await approveButton.count() > 0) {
    console.log('Found approve button, clicking it...');
    await approveButton.click();
    // wait for navigation to /appointments
    await page.waitForURL('**/appointments', { timeout: 3000 }).catch(()=>{});
    const after = await page.evaluate(() => localStorage.getItem('approvedAppointments'));
    console.log('afterApproved=', after);
  } else {
    console.log('No approve button found on dashboard.');
  }

  await browser.close();
})();