import React from "react";

export default function TripPage({ data, params, navigate }) {
  const tripId = params.get("trip_id");
  console.log("Trip ID:", tripId);

  const trip = (data.trips || []).find((t) => t._id === tripId);

  if (!trip) {
    return (
      <div>
        <h2>Trajet non trouvé</h2>
        <p>ID recherché: {tripId}</p>
        <button onClick={() => navigate("/search", "")}>Retour</button>
      </div>
    );
  }

  const user = (data.users || []).find((u) => u._id === trip.conductorId);

  return (
    <div>
      <h2>Détails du trajet</h2>
      <p>
        <strong>
          {trip.villeDepart} → {trip.villeArrivee}
        </strong>
      </p>
      <p>
        Conducteur: {user ? `${user.name} ${user.surname}` : trip.conductorId}
      </p>
      <p>Départ: {new Date(trip.departureTime).toLocaleString()}</p>
      <p>Prix: {trip.price} €</p>
      <p>Places libres: {trip.nbPlacesVides}</p>
      <p>Point de rencontre: {trip.meetingPoint}</p>
      <p>Voiture: {trip.carModel}</p>
      <p>Statut: {trip.status}</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/booking", `trip_id=${trip._id}`)}>
          Réserver
        </button>
        <button
          onClick={() => navigate("/search", "")}
          style={{ marginLeft: "10px" }}
        >
          Retour
        </button>
      </div>
    </div>
  );
}
