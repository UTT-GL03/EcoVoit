/**
 * Scénario GreenFrame - Parcours complet de réservation EcoVoit
 * Mesure : Recherche → Consultation → Réservation → Confirmation
 */
const parcoursComplet = async (page) => {
  // ============================================
  // ÉTAPE 1 : CHARGEMENT DE LA PAGE D'ACCUEIL
  // ============================================
  console.log("📍 Étape 1 : Chargement de la page d'accueil");
  await page.goto("http://localhost/", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2000);

  // ============================================
  // ÉTAPE 2 : RECHERCHE DE TRAJETS
  // ============================================
  console.log("📍 Étape 2 : Recherche Paris → Lyon");

  // Saisir la ville de départ
  await page.type('input[placeholder="Ville de départ"]', "Paris");
  await page.waitForTimeout(500);

  // Saisir la ville d'arrivée
  await page.type('input[placeholder="Ville d\'arrivée"]', "Lyon");
  await page.waitForTimeout(1000);

  // Attendre le filtrage des résultats
  await page.waitForNetworkIdle();
  await page.waitForTimeout(1000);

  // Scroller pour voir les résultats
  await page.evaluate(() => {
    window.scrollBy(0, 300);
  });
  await page.waitForTimeout(1000);

  // ============================================
  // ÉTAPE 3 : CONSULTATION D'UN TRAJET
  // ============================================
  console.log("📍 Étape 3 : Consultation du premier trajet");

  // Cliquer sur le premier bouton "Voir"
  await page.click("ul li button");
  await page.waitForTimeout(2000);
  await page.waitForNetworkIdle();

  // Consulter les détails du trajet
  await page.evaluate(() => {
    window.scrollBy(0, 400);
  });
  await page.waitForTimeout(2000);

  // ============================================
  // ÉTAPE 4 : PASSAGE À LA RÉSERVATION
  // ============================================
  console.log("📍 Étape 4 : Passage à la réservation");

  // Scroller vers le bouton Réserver
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const reserverBtn = buttons.find((btn) =>
      btn.textContent.includes("Réserver")
    );
    if (reserverBtn) {
      reserverBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  await page.waitForTimeout(1000);

  // Cliquer sur Réserver
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const reserverBtn = buttons.find((btn) =>
      btn.textContent.includes("Réserver")
    );
    if (reserverBtn) reserverBtn.click();
  });
  await page.waitForTimeout(2000);
  await page.waitForNetworkIdle();

  // ============================================
  // ÉTAPE 5 : REMPLISSAGE DU FORMULAIRE
  // ============================================
  console.log("📍 Étape 5 : Remplissage du formulaire de réservation");

  // Attendre que le formulaire soit chargé
  await page.waitForSelector("form");
  await page.waitForTimeout(1000);

  // Remplir le nom
  await page.type('input[type="text"]', "Jean Dupont", { delay: 50 });
  await page.waitForTimeout(500);

  // Remplir l'email
  await page.type('input[type="email"]', "jean.dupont@email.com", {
    delay: 50,
  });
  await page.waitForTimeout(500);

  // Remplir le téléphone
  await page.type('input[type="tel"]', "0612345678", { delay: 50 });
  await page.waitForTimeout(500);

  // ============================================
  // ÉTAPE 6 : CONSULTATION DU RÉCAPITULATIF
  // ============================================
  console.log("📍 Étape 6 : Consultation du récapitulatif");

  // Scroller vers le récapitulatif du prix
  await page.evaluate(() => {
    const priceSummary = document.querySelector(".price-summary");
    if (priceSummary) {
      priceSummary.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  await page.waitForTimeout(1500);

  // Consulter l'impact carbone (si affiché)
  await page.evaluate(() => {
    window.scrollBy(0, 200);
  });
  await page.waitForTimeout(1000);

  // ============================================
  // ÉTAPE 7 : VALIDATION DE LA RÉSERVATION
  // ============================================
  console.log("📍 Étape 7 : Validation de la réservation");

  // Scroller vers le bouton de confirmation
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  await page.waitForTimeout(1000);

  // Cliquer sur Confirmer
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await page.waitForNetworkIdle();

  // Consulter le message de confirmation
  await page.evaluate(() => {
    const message = document.querySelector(".message");
    if (message) {
      message.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  await page.waitForTimeout(2000);

  // ============================================
  // ÉTAPE 8 : RETOUR À L'ACCUEIL
  // ============================================
  console.log("📍 Étape 8 : Retour à l'accueil");

  // Attendre la redirection automatique
  await page.waitForTimeout(3000);

  // Vérifier le retour
  await page.waitForNetworkIdle();
  await page.waitForTimeout(1000);

  console.log("✅ Parcours complet terminé");
};

module.exports = parcoursComplet;
