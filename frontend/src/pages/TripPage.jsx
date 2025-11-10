import React from "react";

export default function TripPage({ data, params, navigate }) {
  const tripId = params.get("trip_id");
  const trip = (data.trips || []).find((t) => t.id === tripId);
  if (!trip) return <div>Trajet non trouvé</div>;
  const user = (data.users || []).find((u) => u.id === trip.conductorId);

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
      <div>
        <button onClick={() => navigate("/booking", `trip_id=${trip.id}`)}>
          Réserver
        </button>
      </div>
    </div>
  );
}
