import "./App.css";
import TripCard from "./components/trip/TripCard";
import { useState, useEffect } from "react";
import TripDetailModal from "./components/trip/TripDetailModal";
import SearchPage from "./pages/SearchPage";
import TripPage from "./pages/TripPage";
import BookingPage from "./pages/BookingPage";
import UserPage from "./pages/UserPage";

function App() {
  // removed modal state (we use page navigation instead)

  // données chargées dynamiquement depuis public/sample_data.json
  const [data, setData] = useState({ users: [], trips: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // simple router state
  const [route, setRoute] = useState({
    path: window.location.pathname,
    params: new URLSearchParams(window.location.search),
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/sample_data.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
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

  // handle browser navigation (back/forward)
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
      params: new URLSearchParams(search || window.location.search),
    });
  };

  // helper functions (if needed by pages, they can use data directly)

  // routing - decide which page to render
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
    // default to search
    page = <SearchPage data={data} navigate={navigate} />;
  }

  return (
    <div className={"main-container"}>
      <header className={"header"}>
        <h1 className={"app-title"}>🚗 EcoVoit</h1>
        <p className={"app-subtitle"}>Covoiturage écoresponsable</p>
        <nav style={{ marginTop: 8 }}>
          <button onClick={() => navigate("/search")}>Accueil</button>
          <button onClick={() => navigate("/search")}>Rechercher</button>
        </nav>
      </header>

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <div style={{ color: "#6b7280" }}>Chargement…</div>
        ) : error ? (
          <div style={{ color: "#ef4444" }}>Erreur: {error}</div>
        ) : (
          page
        )}
      </div>

      {/* modal removed; use separate pages for details and booking */}
    </div>
  );
  // helper functions removed (not needed with page navigation)
}

export default App;
