import "./App.css";
import { useState, useEffect } from "react";
import SearchPage from "./pages/SearchPage";
import TripPage from "./pages/TripPage";
import BookingPage from "./pages/BookingPage";
import UserPage from "./pages/UserPage";

function App() {
  const [data, setData] = useState({ users: [], trips: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState({
    path: window.location.pathname,
    params: new URLSearchParams(window.location.search),
  });

  // Configuration CouchDB
  const COUCHDB_URL = "/api";
  const COUCHDB_USER = "admin";
  const COUCHDB_PASSWORD = "password";

  useEffect(() => {
    const loadData = async () => {
      try {
        // Créer les headers d'authentification
        const auth = btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`);
        const headers = {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        };

        // Récupérer les utilisateurs
        const usersResponse = await fetch(
          `${COUCHDB_URL}/users/_all_docs?include_docs=true`,
          { headers }
        );
        if (!usersResponse.ok)
          throw new Error(`Users: HTTP ${usersResponse.status}`);
        const usersJson = await usersResponse.json();

        // Récupérer les trajets
        const tripsResponse = await fetch(
          `${COUCHDB_URL}/trips/_all_docs?include_docs=true`,
          { headers }
        );
        if (!tripsResponse.ok)
          throw new Error(`Trips: HTTP ${tripsResponse.status}`);
        const tripsJson = await tripsResponse.json();

        // Récupérer les réservations
        const bookingsResponse = await fetch(
          `${COUCHDB_URL}/bookings/_all_docs?include_docs=true`,
          { headers }
        );
        if (!bookingsResponse.ok)
          throw new Error(`Bookings: HTTP ${bookingsResponse.status}`);
        const bookingsJson = await bookingsResponse.json();

        // Créer l'objet data au format attendu (comme avec sample_data.json)
        setData({
          users: usersJson.rows.map((row) => row.doc),
          trips: tripsJson.rows.map((row) => row.doc),
          bookings: bookingsJson.rows.map((row) => row.doc),
        });
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  console.log("Data loaded:", data);

  useEffect(() => {
    const onPop = () =>
      setRoute({
        path: window.location.pathname,
        params: new URLSearchParams(window.location.search),
      });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path, search) => {
    const url = path + (search ? `?${search}` : "");
    window.history.pushState({}, "", url);
    setRoute({
      path,
      params: new URLSearchParams(search || ""),
    });
  };

  let page = null;
  if (route.path === "/" || route.path === "/search") {
    page = <SearchPage data={data} navigate={navigate} />;
  } else if (route.path === "/trip") {
    page = <TripPage data={data} params={route.params} navigate={navigate} />;
  } else if (route.path === "/booking") {
    page = (
      <BookingPage data={data} params={route.params} navigate={navigate} />
    );
  } else if (route.path === "/user") {
    page = <UserPage data={data} params={route.params} navigate={navigate} />;
  } else {
    page = <SearchPage data={data} navigate={navigate} />;
  }

  return (
    <div className={"main-container"}>
      <header className={"header"}>
        <h1 className={"app-title"}>🚗 EcoVoit</h1>
        <p className={"app-subtitle"}>Covoiturage écoresponsable</p>
        <nav style={{ marginTop: 8 }}>
          <button onClick={() => navigate("/search", "")}>Accueil</button>
          <button onClick={() => navigate("/search", "")}>Rechercher</button>
        </nav>
      </header>

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <div
            style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}
          >
            ⏳ Chargement des données depuis CouchDB...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#ef4444",
              backgroundColor: "#fee",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
            }}
          >
            <strong>❌ Erreur de connexion:</strong> {error}
            <p style={{ fontSize: "0.875rem", marginTop: 8, color: "#666" }}>
              Vérifiez que :
            </p>
            <ul
              style={{
                fontSize: "0.875rem",
                color: "#666",
                marginLeft: "20px",
              }}
            >
              <li>CouchDB est démarré (http://localhost:5984)</li>
              <li>Les identifiants sont corrects (admin/password)</li>
              <li>CORS est configuré (voir instructions)</li>
              <li>Les bases users, trips, bookings existent</li>
            </ul>
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#059669",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              ✅ {data.users.length} utilisateurs, {data.trips.length} trajets,{" "}
              {data.bookings.length} réservations chargés
            </div>
            {page}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
