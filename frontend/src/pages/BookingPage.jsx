import React, { useState } from "react";

export default function BookingPage({ data, params, navigate }) {
  const tripId = params.get("trip_id");
  const [seats, setSeats] = useState(1);
  const [name, setName] = useState("");
  const trip = (data.trips || []).find((t) => t.id === tripId);
  if (!trip) return <div>Trajet non trouvé</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Réserver", { tripId, seats, name });
    alert("Réservation simulée — voir la console");
    navigate("/search");
  };

  return (
    <div>
      <h2>Réserver un trajet</h2>
      <p>
        {trip.villeDepart} → {trip.villeArrivee} —{" "}
        {new Date(trip.departureTime).toLocaleString()}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <label>
          Nom complet
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Nombre de places
          <input
            type="number"
            min={1}
            max={trip.nbPlacesVides || 1}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            required
          />
        </label>
        <div>
          <button type="submit">Confirmer la réservation</button>
        </div>
      </form>
    </div>
  );
}
