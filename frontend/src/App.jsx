import "./App.css";
import TripCard from "./components/trip/TripCard";
import sampleData from "./data/sample_data.json";
import { useState } from 'react';
import TripDetailModal from './components/trip/TripDetailModal';

function App() {

    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

  const availableTrips = sampleData.trips
    .filter((trip) => trip.status === "available")
    .slice(0, 10);

  const getUserForTrip = (conductorId) => {
    return sampleData.users.find((user) => user.id === conductorId);
  };

  return (
    <div className={"main-container"}>
      <header className={"header"}     >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#10b981",
            margin: 0,
          }}
        >
          🚗 EcoVoit
        </h1>
        <p
          style={{
            color: "#6b7280",
            margin: "0.5rem 0 0 0",
          }}
        >
          Covoiturage écoresponsable
        </p>
      </header>

      <div className={"card"} >
        <h2
          style={{
              color: "#10b981",
              fontSize: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          📊 Données chargées
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}
            >
              {sampleData.users.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Utilisateurs
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}
            >
              {sampleData.trips.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Trajets
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}
            >
              {sampleData.bookings.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Réservations
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}
            >
              {availableTrips.length}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Trajets disponibles
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "1rem",
            color:  "#10b981",
          }}
        >
          Trajets disponibles
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {availableTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              user={getUserForTrip(trip.conductorId)}
              onViewDetails={() => openModal(trip)}
              />
          ))}
        </div>

        {availableTrips.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "3rem",
              borderRadius: "12px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Aucun trajet disponible pour le moment
          </div>
        )}
      </div>

        {isModalOpen && selectedTrip && (
            <TripDetailModal
                trip={selectedTrip}
                user={getUserForTrip(selectedTrip.conductorId)}
                onClose={closeModal}
            />
        )}

    </div>
  );
}

export default App;
