import "./App.css";
import { useState, useEffect } from "react";
import SearchPage from "./pages/SearchPage";
import TripPage from "./pages/TripPage";
import BookingPage from "./pages/BookingPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [route, setRoute] = useState({
    path: window.location.pathname,
    params: new URLSearchParams(window.location.search),
  });

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
    page = <SearchPage navigate={navigate} />;
  } else if (route.path === "/trip") {
    page = <TripPage params={route.params} navigate={navigate} />;
  } else if (route.path === "/booking") {
    page = <BookingPage params={route.params} navigate={navigate} />;
  } else if (route.path === "/user") {
    page = <UserPage params={route.params} navigate={navigate} />;
  } else if (route.path === "/admin") {
    page = <AdminPage navigate={navigate} />;
  } else {
    page = <SearchPage navigate={navigate} />;
  }

  return (
    <div className={"main-container"}>
      <header className={"header"}>
        <div>
          <h1 className={"app-title"}>🚗 EcoVoit</h1>
          <p className={"app-subtitle"}>Covoiturage écoresponsable</p>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/search", "")}>Accueil</button>
          <button onClick={() => navigate("/search", "")}>Rechercher</button>
          <button
            onClick={() => navigate("/admin", "")}
            style={{ background: "#6b7280" }}
          >
            Admin
          </button>
        </nav>
      </header>

      <div style={{ marginTop: 16 }}>{page}</div>
    </div>
  );
}

export default App;
