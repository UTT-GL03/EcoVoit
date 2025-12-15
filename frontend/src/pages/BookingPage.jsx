import React, { useState, useEffect } from "react";

export default function BookingPage({ params, navigate }) {
  const tripId = params.get("trip_id");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [name, setName] = useState("");

  const COUCHDB_URL = "/api";

  useEffect(() => {
    const auth = btoa("admin:password");
    const headers = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    };

    const loadTrip = async () => {
      try {
        const response = await fetch(`${COUCHDB_URL}/trips/${tripId}`, {
          headers,
        });
        if (!response.ok) throw new Error("Trajet non trouvé");
        const data = await response.json();
        setTrip(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Réserver", { tripId, seats, name });
    alert("Réservation simulée — voir la console");
    navigate("/search", "");
  };

  if (loading) return <div>Chargement...</div>;
  if (!trip) return <div>Trajet non trouvé</div>;

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
