import React, { useState } from "react";

export default function SearchPage({ data, navigate }) {
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [date, setDate] = useState("");

  const trips = (data.trips || []).filter((t) => {
    if (dep && !t.villeDepart?.toLowerCase().includes(dep.toLowerCase()))
      return false;
    if (arr && !t.villeArrivee?.toLowerCase().includes(arr.toLowerCase()))
      return false;
    if (date && !t.departureTime?.startsWith(date)) return false;
    return t.status === "available";
  });

  return (
    <div>
      <h2>Rechercher un trajet</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "grid", gap: 8 }}
      >
        <input
          placeholder="Ville de départ"
          value={dep}
          onChange={(e) => setDep(e.target.value)}
        />
        <input
          placeholder="Ville d'arrivée"
          value={arr}
          onChange={(e) => setArr(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <button
            type="button"
            onClick={() => {
              setDep("");
              setArr("");
              setDate("");
            }}
          >
            Effacer
          </button>
        </div>
      </form>

      <h3>Résultats ({trips.length})</h3>
      <ul>
        {trips.map((trip) => (
          <li key={trip._id} style={{ marginBottom: 8 }}>
            <strong>
              {trip.villeDepart} → {trip.villeArrivee}
            </strong>{" "}
            — {trip.price}€ — {new Date(trip.departureTime).toLocaleString()}
            <div>
              <button onClick={() => navigate("/trip", `trip_id=${trip._id}`)}>
                Voir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
