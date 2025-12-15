import React, { useState, useEffect, useCallback } from "react";
import "./AdminPage.css";

export default function AdminPage({ navigate }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    availableTrips: 0,
    totalCO2Saved: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const COUCHDB_URL = "/api";
  const auth = btoa("admin:password");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, tripsRes, bookingsRes] = await Promise.all([
        fetch(`${COUCHDB_URL}/users/_all_docs?include_docs=true`, { headers }),
        fetch(`${COUCHDB_URL}/trips/_all_docs?include_docs=true`, { headers }),
        fetch(`${COUCHDB_URL}/bookings/_all_docs?include_docs=true`, {
          headers,
        }),
      ]);

      const usersData = await usersRes.json();
      const tripsData = await tripsRes.json();
      const bookingsData = await bookingsRes.json();

      const users = usersData.rows
        .map((r) => r.doc)
        .filter((doc) => doc && !doc._id.startsWith("_design"));
      const trips = tripsData.rows
        .map((r) => r.doc)
        .filter((doc) => doc && !doc._id.startsWith("_design"));
      const bookings = bookingsData.rows
        .map((r) => r.doc)
        .filter((doc) => doc && !doc._id.startsWith("_design"));

      const availableTrips = trips.filter(
        (t) => t.status === "available"
      ).length;
      const totalCO2 = bookings.length * 50;

      setStats({
        totalUsers: users.length,
        totalTrips: trips.length,
        totalBookings: bookings.length,
        availableTrips,
        totalCO2Saved: Math.round(totalCO2),
      });

      const sortedBookings = bookings
        .filter((b) => b.dateBooking)
        .sort((a, b) => new Date(b.dateBooking) - new Date(a.dateBooking))
        .slice(0, 5)
        .map((booking) => {
          const trip = trips.find((t) => t._id === booking.tripId);
          return { ...booking, trip: trip || null };
        });

      setRecentBookings(sortedBookings);

      const sortedTrips = trips
        .filter((t) => t.departureTime && t.villeDepart && t.villeArrivee)
        .sort((a, b) => new Date(b.departureTime) - new Date(a.departureTime))
        .slice(0, 5);

      setRecentTrips(sortedTrips);
    } catch (error) {
      console.error("Erreur chargement données admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadAdminData();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadAdminData]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Chargement du tableau de bord</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-text">
            <h1>Tableau de bord administrateur</h1>
            <p>Vue d'ensemble et gestion de la plateforme</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-secondary" onClick={loadAdminData}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              Actualiser
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/search", "")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {/* Statistiques principales */}
        <div className="stats-grid">
          {/* Utilisateurs */}
          <div className="stat-card stat-primary">
            <div className="stat-header">
              <div className="stat-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="stat-label">Utilisateurs</span>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-description">Membres inscrits</div>
          </div>

          {/* Trajets */}
          <div className="stat-card stat-info">
            <div className="stat-header">
              <div className="stat-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="stat-label">Trajets</span>
            </div>
            <div className="stat-value">{stats.totalTrips}</div>
            <div className="stat-description">Trajets créés</div>
          </div>

          {/* Réservations */}
          <div className="stat-card stat-warning">
            <div className="stat-header">
              <div className="stat-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="stat-label">Réservations</span>
            </div>
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-description">Total des réservations</div>
          </div>

          {/* CO2 */}
          <div className="stat-card stat-success">
            <div className="stat-header">
              <div className="stat-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <span className="stat-label">Impact</span>
            </div>
            <div className="stat-value">{stats.totalCO2Saved} kg</div>
            <div className="stat-description">CO₂ économisé</div>
          </div>
        </div>

        {/* Statistiques secondaires */}
        <div className="secondary-stats">
          <div className="secondary-stat">
            <div className="secondary-stat-value">{stats.availableTrips}</div>
            <div className="secondary-stat-label">Trajets disponibles</div>
          </div>
          <div className="secondary-stat">
            <div className="secondary-stat-value">
              {stats.totalBookings > 0
                ? Math.round((stats.totalBookings / stats.totalTrips) * 100)
                : 0}
              %
            </div>
            <div className="secondary-stat-label">Taux de réservation</div>
          </div>
          <div className="secondary-stat">
            <div className="secondary-stat-value">
              {stats.totalTrips > 0
                ? Math.round((stats.totalBookings / stats.totalTrips) * 10) / 10
                : 0}
            </div>
            <div className="secondary-stat-label">Réservations par trajet</div>
          </div>
        </div>

        {/* Données récentes */}
        <div className="data-grid">
          {/* Réservations récentes */}
          <div className="data-card">
            <div className="data-card-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h3>Réservations récentes</h3>
            </div>
            <div className="data-card-body">
              {recentBookings.length === 0 ? (
                <div className="empty-state">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                  <p>Aucune réservation</p>
                </div>
              ) : (
                <div className="list-items">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="list-item">
                      <div className="list-item-content">
                        {booking.trip ? (
                          <>
                            <div className="list-item-title">
                              {booking.trip.villeDepart}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                              {booking.trip.villeArrivee}
                            </div>
                            <div className="list-item-subtitle">
                              {booking.passengerName || "Passager"}
                            </div>
                            <div className="list-item-meta">
                              <span>{booking.nbPlacesLouees} place(s)</span>
                              <span>{booking.price} €</span>
                            </div>
                          </>
                        ) : booking.tripInfo ? (
                          <>
                            <div className="list-item-title">
                              {booking.tripInfo.departure}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                              {booking.tripInfo.arrival}
                            </div>
                            <div className="list-item-subtitle">
                              {booking.passengerName || "Passager"}
                            </div>
                            <div className="list-item-meta">
                              <span>{booking.nbPlacesLouees} place(s)</span>
                              <span>{booking.price} €</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="list-item-title text-danger">
                              Trajet supprimé
                            </div>
                            <div className="list-item-subtitle">
                              {booking.passengerName || "Passager"}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="list-item-date">
                        {booking.dateBooking ? (
                          new Date(booking.dateBooking).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )
                        ) : (
                          <span className="text-danger">Date invalide</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trajets récents */}
          <div className="data-card">
            <div className="data-card-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3>Trajets récents</h3>
            </div>
            <div className="data-card-body">
              {recentTrips.length === 0 ? (
                <div className="empty-state">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                  <p>Aucun trajet</p>
                </div>
              ) : (
                <div className="list-items">
                  {recentTrips.map((trip) => (
                    <div key={trip._id} className="list-item">
                      <div className="list-item-content">
                        <div className="list-item-title">
                          {trip.villeDepart || "?"}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                          {trip.villeArrivee || "?"}
                        </div>
                        <div className="list-item-meta">
                          <span>{trip.nbPlacesVides || 0} place(s)</span>
                          <span>{trip.price || 0} €</span>
                        </div>
                        <span
                          className={`badge badge-${
                            trip.status === "available"
                              ? "success"
                              : trip.status === "full"
                              ? "warning"
                              : trip.status === "completed"
                              ? "info"
                              : "danger"
                          }`}
                        >
                          {trip.status === "available"
                            ? "Disponible"
                            : trip.status === "full"
                            ? "Complet"
                            : trip.status === "completed"
                            ? "Terminé"
                            : trip.status || "?"}
                        </span>
                      </div>
                      <div className="list-item-date">
                        {trip.departureTime ? (
                          new Date(trip.departureTime).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )
                        ) : (
                          <span className="text-danger">Date invalide</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="actions-card">
          <div className="actions-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <h3>Actions rapides</h3>
          </div>
          <div className="actions-grid">
            <button
              className="action-button"
              onClick={() =>
                window.open("http://localhost:5984/_utils", "_blank")
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <span>Ouvrir CouchDB Fauxton</span>
            </button>
            <button className="action-button" onClick={loadAdminData}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
              <span>Actualiser les données</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
