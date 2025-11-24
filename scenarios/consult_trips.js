module.exports = async (page) => {
  await page.goto("http://localhost/", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(2000);

  await page.waitForTimeout(3000);
};
