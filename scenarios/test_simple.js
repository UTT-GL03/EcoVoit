const visit = async (page) => {
  console.log("🚀 Démarrage du test simple...");

  // Juste aller sur la page, sans attendre rien de compliqué
  await page.goto("", {
    waitUntil: "domcontentloaded",
  });

  console.log("✅ Page chargée !");
};

module.exports = visit;
