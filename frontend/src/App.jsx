import "./App.css";
import TripCard from "./components/trip/TripCard";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({ users: [], trips: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/sample_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const availableTrips = data.trips
    .filter((trip) => trip.status === "available")
    .slice(0, 10);

  const getUserForTrip = (conductorId) => {
    return data.users.find((user) => user.id === conductorId);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">🚗 EcoRide</h1>
        <p className="app-subtitle">Covoiturage écoresponsable</p>
      </header>

      <div className="stats">
        <h2 className="section-title">📊 Données chargées</h2>
        {loading && (
          <div style={{ color: "#6b7280" }}>Chargement…</div>
        )}
        {error && (
          <div style={{ color: "#ef4444" }}>Erreur: {error}</div>
        )}
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{data.users.length}</div>
            <div className="stat-label">Utilisateurs</div>
          </div>
          <div className="stat">
            <div className="stat-value">{data.trips.length}</div>
            <div className="stat-label">Trajets</div>
          </div>
          <div className="stat">
            <div className="stat-value">{data.bookings.length}</div>
            <div className="stat-label">Réservations</div>
          </div>
          <div className="stat">
            <div className="stat-value">{availableTrips.length}</div>
            <div className="stat-label">Trajets disponibles</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">Trajets disponibles</h2>

        <div className="trips-list">
          {availableTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              user={getUserForTrip(trip.conductorId)}
            />
          ))}
        </div>

        {availableTrips.length === 0 && (
          <div className="empty-box">
            Aucun trajet disponible pour le moment
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
