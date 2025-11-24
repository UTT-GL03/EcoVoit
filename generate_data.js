const fs = require("fs");

// Générer les utilisateurs
const users = Array.from({ length: 50 }, (_, i) => ({
  _id: `user-${i}`,
  name: [
    "Thomas",
    "Marie",
    "Lucas",
    "Sophie",
    "Antoine",
    "Emma",
    "Hugo",
    "Léa",
    "Noah",
    "Chloé",
  ][Math.floor(Math.random() * 10)],
  surname: [
    "Martin",
    "Bernard",
    "Dubois",
    "Petit",
    "Robert",
    "Richard",
    "Durand",
    "Leroy",
    "Moreau",
    "Simon",
  ][Math.floor(Math.random() * 10)],
  email: `user${i}@ecovoit.fr`,
  phone: `06-${String(Math.floor(Math.random() * 100)).padStart(
    2,
    "0"
  )}-${String(Math.floor(Math.random() * 100)).padStart(2, "0")}-${String(
    Math.floor(Math.random() * 100)
  ).padStart(2, "0")}-${String(Math.floor(Math.random() * 100)).padStart(
    2,
    "0"
  )}`,
  avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
  totalTrips: Math.floor(Math.random() * 100),
  rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
}));

// Générer les trajets
const villes = [
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Bordeaux",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Lille",
  "Rennes",
];
const voitures = [
  "Renault Clio",
  "Peugeot 208",
  "Tesla Model 3",
  "VW Golf",
  "Citroën C3",
  "Dacia Sandero",
];

const trips = Array.from({ length: 100 }, (_, i) => ({
  _id: `trip-${i}`,
  conductorId: `user-${Math.floor(Math.random() * 50)}`,
  villeDepart: villes[Math.floor(Math.random() * villes.length)],
  villeArrivee: villes[Math.floor(Math.random() * villes.length)],
  price: Math.floor(Math.random() * 70) + 10,
  nbPlacesVides: Math.floor(Math.random() * 4) + 1,
  meetingPoint: `Point de rendez-vous ${i}`,
  carModel: voitures[Math.floor(Math.random() * voitures.length)],
  status: ["available", "full", "completed", "cancelled"][
    Math.floor(Math.random() * 4)
  ],
  departureTime: new Date(
    2025,
    11,
    Math.floor(Math.random() * 30) + 1,
    Math.floor(Math.random() * 24),
    0,
    0
  )
    .toISOString()
    .slice(0, 19),
}));

// Générer les réservations avec références VALIDES
const bookings = Array.from({ length: 150 }, (_, i) => {
  const tripIndex = Math.floor(Math.random() * 100);
  return {
    _id: `booking-${Date.now()}-${i}`,
    tripId: `trip-${tripIndex}`,
    passengerId: `user-${Math.floor(Math.random() * 50)}`,
    price: trips[tripIndex].price,
    nbPlacesLouees: Math.floor(Math.random() * 3) + 1,
    dateBooking: new Date(
      2025,
      10,
      Math.floor(Math.random() * 24) + 1,
      Math.floor(Math.random() * 24),
      30,
      0
    )
      .toISOString()
      .slice(0, 19),
  };
});

// Créer le dossier public s'il n'existe pas
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

// Sauvegarder les fichiers
fs.writeFileSync(
  "public/users_data.json",
  JSON.stringify({ docs: users }, null, 2)
);
fs.writeFileSync(
  "public/trips_data.json",
  JSON.stringify({ docs: trips }, null, 2)
);
fs.writeFileSync(
  "public/bookings_data.json",
  JSON.stringify({ docs: bookings }, null, 2)
);

console.log("✅ Fichiers générés avec relations cohérentes!");
console.log(`  • ${users.length} utilisateurs`);
console.log(`  • ${trips.length} trajets`);
console.log(`  • ${bookings.length} réservations`);
