import React, { useState, useEffect, useCallback } from "react";

export default function SearchPage({ navigate }) {
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // États pour la pagination
  const [nextBookmark, setNextBookmark] = useState();
  const [requestedBookmark, setRequestedBookmark] = useState();
  const [hasMore, setHasMore] = useState(true);

  const COUCHDB_URL = "/api";
  const COUCHDB_USER = "admin";
  const COUCHDB_PASSWORD = "password";
  const LIMIT = 10;

  // Réinitialiser quand les filtres changent
  useEffect(() => {
    setTrips([]);
    setRequestedBookmark(undefined);
    setNextBookmark(undefined);
    setHasMore(true);
  }, [dep, arr, date]);

  // Fonction pour rechercher les trajets avec CouchDB _find
  const searchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const auth = btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`);
      const headers = {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      };

      // Construire le sélecteur dynamiquement
      const selector = {
        status: "available",
      };

      if (dep) {
        selector.villeDepart = dep;
      }

      if (arr) {
        selector.villeArrivee = arr;
      }

      if (date) {
        selector.departureTime = {
          $gte: `${date}T00:00:00`,
          $lt: `${date}T23:59:59`,
        };
      }

      const response = await fetch(`${COUCHDB_URL}/trips/_find`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          selector,
          bookmark: requestedBookmark,
          limit: LIMIT,
          use_index: "trips_search_index",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Trier les résultats côté client par date
      const sortedTrips = (result.docs || []).sort(
        (a, b) => new Date(a.departureTime) - new Date(b.departureTime)
      );

      // Si c'est la première page, remplace les résultats
      // Sinon, ajoute à la suite
      setTrips((prevTrips) => {
        if (!requestedBookmark) {
          return sortedTrips;
        } else {
          return [...prevTrips, ...sortedTrips];
        }
      });

      // Sauvegarde le bookmark pour la page suivante
      setNextBookmark(result.bookmark);

      // S'il n'y a plus de résultats, on désactive le bouton
      setHasMore(result.docs.length === LIMIT);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setTrips([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [dep, arr, date, requestedBookmark]);

  // Charger les trajets quand requestedBookmark change
  useEffect(() => {
    searchTrips();
  }, [searchTrips]);

  // Fonction pour charger la page suivante
  const loadMore = () => {
    setRequestedBookmark(nextBookmark);
  };

  return (
    <div>
      <h2>Rechercher un trajet</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "grid", gap: 8, maxWidth: 600, margin: "0 auto" }}
      >
        <input
          placeholder="Ville de départ (ex: Paris)"
          value={dep}
          onChange={(e) => setDep(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <input
          placeholder="Ville d'arrivée (ex: Lyon)"
          value={arr}
          onChange={(e) => setArr(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <div>
          <button
            type="button"
            onClick={() => {
              setDep("");
              setArr("");
              setDate("");
            }}
            style={{ padding: 12, width: "100%" }}
          >
            Effacer
          </button>
        </div>
      </form>

      <h3 style={{ marginTop: 24 }}>Résultats ({trips.length})</h3>

      {loading && trips.length === 0 ? (
        <div style={{ color: "#6b7280", padding: "20px", textAlign: "center" }}>
          🔍 Recherche en cours...
        </div>
      ) : trips.length === 0 ? (
        <div style={{ color: "#6b7280", padding: "20px", textAlign: "center" }}>
          Aucun trajet trouvé pour ces critères.
        </div>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {trips.map((trip) => (
              <li key={trip._id} className="card" style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "1.1rem" }}>
                      {trip.villeDepart} → {trip.villeArrivee}
                    </strong>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.9rem",
                        marginTop: 4,
                      }}
                    >
                      📅 {new Date(trip.departureTime).toLocaleString("fr-FR")}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                      💺 {trip.nbPlacesVides} place(s) • 🚗 {trip.carModel}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#10b981",
                      }}
                    >
                      {trip.price}€
                    </div>
                    <button
                      onClick={() => navigate("/trip", `trip_id=${trip._id}`)}
                      style={{ marginTop: 8, padding: "8px 16px" }}
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Bouton "Charger plus" */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Chargement..." : "Charger plus"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
