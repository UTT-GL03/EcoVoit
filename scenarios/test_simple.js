const visit = async (page) => {
  console.log("🚀 Démarrage du test simple...");

  await page.goto("", {
    waitUntil: "domcontentloaded",
  });

  console.log("✅ Page chargée !");
};

module.exports = visit;
