/**
 * Fonction manuelle pour attendre (remplace waitForTimeout qui fait planter)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const visit = async (page) => {
  console.log("1. Navigation vers la page...");
  // On utilise 'domcontentloaded' car 'networkidle' bug souvent avec Vite
  await page.goto("", {
    waitUntil: "domcontentloaded",
  });

  console.log("2. Attente de 10 secondes...");
  await delay(10000);

  console.log("3. Scroll vers le bas...");
  // On scrolle manuellement avec du JS standard, c'est incassable
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  console.log("4. Attente finale de 7 secondes...");
  await delay(7000);

  console.log("✅ Scénario terminé.");
};

module.exports = visit;
