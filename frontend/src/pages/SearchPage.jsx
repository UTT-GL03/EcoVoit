import React, { useState, useEffect, useCallback } from "react";

export default function SearchPage({ data, navigate }) {
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nextBookmark, setNextBookmark] = useState();
  const [requestedBookmark, setRequestedBookmark] = useState();
  const [hasMore, setHasMore] = useState(true);

  const COUCHDB_URL = "/api";
  const COUCHDB_USER = "admin";
  const COUCHDB_PASSWORD = "password";
  const LIMIT = 10;

  useEffect(() => {
    setTrips([]);
    setRequestedBookmark(undefined);
    setNextBookmark(undefined);
    setHasMore(true);
  }, [dep, arr, date]);

  const searchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const auth = btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`);
      const headers = {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      };

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

      const sortedTrips = (result.docs || []).sort(
        (a, b) => new Date(a.departureTime) - new Date(b.departureTime)
      );

      setTrips((prevTrips) => {
        if (!requestedBookmark) {
          return sortedTrips;
        } else {
          return [...prevTrips, ...sortedTrips];
        }
      });

      setNextBookmark(result.bookmark);

      setHasMore(result.docs.length === LIMIT);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      const filteredTrips = (data.trips || []).filter((t) => {
        if (dep && !t.villeDepart?.toLowerCase().includes(dep.toLowerCase()))
          return false;
        if (arr && !t.villeArrivee?.toLowerCase().includes(arr.toLowerCase()))
          return false;
        if (date && !t.departureTime?.startsWith(date)) return false;
        return t.status === "available";
      });
      setTrips(filteredTrips);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [dep, arr, date, data.trips, requestedBookmark]);

  useEffect(() => {
    searchTrips();
  }, [searchTrips]);

  const loadMore = () => {
    setRequestedBookmark(nextBookmark);
  };

  return (
    <div>
      <h2>Rechercher un trajet</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "grid", gap: 8 }}
      >
        <input
          placeholder="Ville de départ (ex: Paris)"
          value={dep}
          onChange={(e) => setDep(e.target.value)}
        />
        <input
          placeholder="Ville d'arrivée (ex: Lyon)"
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
          <ul>
            {trips.map((trip) => (
              <li key={trip._id} style={{ marginBottom: 8 }}>
                <strong>
                  {trip.villeDepart} → {trip.villeArrivee}
                </strong>{" "}
                — {trip.price}€ —{" "}
                {new Date(trip.departureTime).toLocaleString()}
                <div>
                  <button
                    onClick={() => navigate("/trip", `trip_id=${trip._id}`)}
                  >
                    Voir
                  </button>
                </div>
              </li>
            ))}
          </ul>

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
