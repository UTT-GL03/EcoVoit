const visit = async (page) => {
  await page.goto("http://localhost/", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    window.scrollBy(0, 500);
  });

  await page.waitForNetworkIdle();

  await page.waitForTimeout(2000);
};
