import "./App.css";
import TripCard from "./components/trip/TripCard";
import sampleData from "./data/sample_data.json";

function App() {
  const availableTrips = sampleData.trips
    .filter((trip) => trip.status === "available")
    .slice(0, 10);

  const getUserForTrip = (conductorId) => {
    return sampleData.users.find((user) => user.id === conductorId);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          background: "white",
          padding: "1.5rem 2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#10b981",
            margin: 0,
          }}
        >
          🚗 EcoRide
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

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
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
    </div>
  );
}

export default App;
