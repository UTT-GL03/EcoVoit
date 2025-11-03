import "./App.css";
import TripCard from "./components/trip/TripCard";
import sampleData from "./data/sample_data.json";
import { useState } from "react";
import TripDetailModal from "./components/trip/TripDetailModal";

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
      <header className={"header"}>
        <h1 className={"app-title"}>🚗 EcoVoit</h1>
        <p className={"app-subtitle"}>Covoiturage écoresponsable</p>
      </header>

      <div className={"card"}>
        <h2 className={"section-title"}>📊 Données chargées</h2>
        <div className={"stats-grid"}>
          <div className={"stat"}>
            <div className={"stat-value"}>{sampleData.users.length}</div>
            <div className={"stat-label"}>Utilisateurs</div>
          </div>
          <div className={"stat"}>
            <div className={"stat-value"}>{sampleData.trips.length}</div>
            <div className={"stat-label"}>Trajets</div>
          </div>
          <div className={"stat"}>
            <div className={"stat-value"}>{sampleData.bookings.length}</div>
            <div className={"stat-label"}>Réservations</div>
          </div>
          <div className={"stat"}>
            <div className={"stat-value"}>{availableTrips.length}</div>
            <div className={"stat-label"}>Trajets disponibles</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className={"section-title"}>Trajets disponibles</h2>

        <div className={"trip-list"}>
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
          <div className={"empty-state"}>
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
