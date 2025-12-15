// Constantes basées sur des données réelles
const CO2_PER_KM_ALONE = 0.2; // kg CO₂ par km (voiture seule)
const CO2_PER_KM_TRAIN = 0.014; // kg CO₂ par km (train)
const TREE_CO2_ABSORPTION = 0.025; // kg CO₂ absorbé par arbre par jour

// Distances approximatives entre villes françaises (en km)
const CITY_DISTANCES = {
  "Paris-Lyon": 465,
  "Paris-Marseille": 775,
  "Paris-Bordeaux": 585,
  "Lyon-Marseille": 315,
  "Paris-Lille": 225,
  "Paris-Toulouse": 680,
  "Lyon-Bordeaux": 560,
  "Marseille-Nice": 200,
  "Paris-Nantes": 385,
  "Lyon-Nice": 470,
};

/**
 * Calcule la distance entre deux villes
 */
export function getDistance(cityA, cityB) {
  const key1 = `${cityA}-${cityB}`;
  const key2 = `${cityB}-${cityA}`;

  if (CITY_DISTANCES[key1]) return CITY_DISTANCES[key1];
  if (CITY_DISTANCES[key2]) return CITY_DISTANCES[key2];

  return 300;
}

/**
 * Calcule l'empreinte carbone d'un trajet
 * @param {string} departure - Ville de départ
 * @param {string} arrival - Ville d'arrivée
 * @param {number} passengers - Nombre de passagers (incluant le conducteur)
 * @returns {object} Statistiques CO₂
 */
export function calculateCarbonFootprint(departure, arrival, passengers = 1) {
  const distance = getDistance(departure, arrival);

  // CO₂ si tout le monde voyage seul
  const aloneTotal = distance * CO2_PER_KM_ALONE * passengers;

  // CO₂ en covoiturage (divisé par le nombre de personnes)
  const carpoolPerPerson = (distance * CO2_PER_KM_ALONE) / passengers;
  const carpoolTotal = distance * CO2_PER_KM_ALONE;

  // CO₂ économisé par rapport à voyager seul
  const savedPerPerson = distance * CO2_PER_KM_ALONE - carpoolPerPerson;
  const savedTotal = aloneTotal - carpoolTotal;

  // Équivalent en arbres (jours d'absorption)
  const treeDays = savedTotal / TREE_CO2_ABSORPTION;

  // Comparaison avec le train
  const trainTotal = distance * CO2_PER_KM_TRAIN * passengers;
  const vsTrainSavings = trainTotal - carpoolTotal;

  return {
    distance,
    aloneTotal: Math.round(aloneTotal * 10) / 10,
    carpoolPerPerson: Math.round(carpoolPerPerson * 10) / 10,
    carpoolTotal: Math.round(carpoolTotal * 10) / 10,
    savedPerPerson: Math.round(savedPerPerson * 10) / 10,
    savedTotal: Math.round(savedTotal * 10) / 10,
    treeDays: Math.round(treeDays),
    trainTotal: Math.round(trainTotal * 10) / 10,
    vsTrainSavings: Math.round(vsTrainSavings * 10) / 10,
    passengers,
  };
}

export function getEcoBadge(savedKg) {
  if (savedKg >= 100) return { level: "Or", emoji: "🥇", color: "#FFD700" };
  if (savedKg >= 50) return { level: "Argent", emoji: "🥈", color: "#C0C0C0" };
  if (savedKg >= 20) return { level: "Bronze", emoji: "🥉", color: "#CD7F32" };
  return { level: "Éco-Débutant", emoji: "🌱", color: "#10b981" };
}
