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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/sample_data.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  console.log(data);

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
    </div>
  );
}

export default App;
