import React, { useState, useEffect, useCallback } from "react";
import CarbonImpact from "../components/carbon/CarbonImpact";

export default function TripPage({ params, navigate }) {
  const tripId = params.get("trip_id");

  // États pour les données
  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la réservation
  const [booking, setBooking] = useState(false);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  const COUCHDB_URL = "/api";

  // Fonction pour créer les headers (stable, pas de dépendances)
  const getHeaders = useCallback(() => {
    const auth = btoa("admin:password");
    return {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    };
  }, []);

  // Charger les données du trajet en temps réel
  const loadTripData = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();

      // Charger le trajet
      const tripResponse = await fetch(`${COUCHDB_URL}/trips/${tripId}`, {
        headers,
      });
      if (!tripResponse.ok) throw new Error("Trajet non trouvé");
      const tripData = await tripResponse.json();
      setTrip(tripData);

      // Charger le conducteur
      if (tripData.conductorId) {
        const userResponse = await fetch(
          `${COUCHDB_URL}/users/${tripData.conductorId}`,
          { headers }
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId, getHeaders]);

  useEffect(() => {
    loadTripData();
  }, [loadTripData]);

  // Fonction de réservation COMPLÈTE
  const handleReservation = async (e) => {
    e.preventDefault();
    setBooking(true);
    setMessage("");

    try {
      const headers = getHeaders();

      // 1. Recharger le trajet pour avoir la version la plus récente
      const tripCheckResponse = await fetch(`${COUCHDB_URL}/trips/${tripId}`, {
        headers,
      });
      if (!tripCheckResponse.ok) throw new Error("Le trajet n'existe plus");

      const currentTrip = await tripCheckResponse.json();

      // 2. Vérifier les places disponibles (en temps réel)
      if (seats > currentTrip.nbPlacesVides) {
        setMessage(
          `Seulement ${currentTrip.nbPlacesVides} place(s) disponible(s)`
        );
        setBooking(false);
        return;
      }

      if (currentTrip.nbPlacesVides === 0) {
        setMessage("Ce trajet est maintenant complet");
        setBooking(false);
        return;
      }

      // 3. Créer la réservation avec informations du passager
      const newBooking = {
        tripId: tripId,
        passengerId: `user-${Date.now()}`,
        passengerName,
        passengerEmail,
        passengerPhone,
        nbPlacesLouees: seats,
        price: currentTrip.price * seats,
        dateBooking: new Date().toISOString(),
        status: "confirmed",
        tripInfo: {
          departure: currentTrip.villeDepart,
          arrival: currentTrip.villeArrivee,
          departureTime: currentTrip.departureTime,
          meetingPoint: currentTrip.meetingPoint,
          driverName: user ? `${user.name} ${user.surname}` : "Conducteur",
        },
      };

      console.log("Création réservation:", newBooking);

      const bookingResponse = await fetch(`${COUCHDB_URL}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(newBooking),
      });

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        throw new Error(`Erreur création réservation: ${errorText}`);
      }

      const bookingResult = await bookingResponse.json();
      console.log("Réservation créée:", bookingResult);

      // 4. Mettre à jour le trajet (réduire places disponibles)
      const updatedTrip = {
        ...currentTrip,
        nbPlacesVides: currentTrip.nbPlacesVides - seats,
        status:
          currentTrip.nbPlacesVides - seats === 0 ? "full" : currentTrip.status,
      };

      console.log("Mise à jour trajet:", updatedTrip);

      const updateResponse = await fetch(`${COUCHDB_URL}/trips/${tripId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedTrip),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Erreur mise à jour trajet: ${errorText}`);
      }

      const updateResult = await updateResponse.json();
      console.log("Trajet mis à jour:", updateResult);

      // 5. Mettre à jour l'affichage local
      setTrip(updatedTrip);

      // 6. Succès !
      setMessage(
        `Réservation confirmée ! Référence: ${bookingResult.id.substring(
          0,
          8
        )}`
      );

      // Rediriger après 3 secondes
      setTimeout(() => {
        navigate("/search", "");
      }, 3000);
    } catch (error) {
      console.error("Erreur réservation:", error);
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setBooking(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          padding: 40,
        }}
      >
        <div style={{ marginTop: 16, color: "#6b7280" }}>
          Chargement du trajet...
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error || !trip) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          className="card"
          style={{ background: "#fee2e2", border: "1px solid #ef4444" }}
        >
          <h2 style={{ color: "#991b1b" }}>Trajet non trouvé</h2>
          <p>ID recherché: {tripId}</p>
          <p style={{ color: "#6b7280" }}>{error}</p>
          <button onClick={() => navigate("/search", "")}>
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  // Affichage principal
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>Détails du trajet</h2>

      {/* Carte principale du trajet */}
      <div className="card">
        <h3 style={{ fontSize: "1.5rem", marginBottom: 16 }}>
          {trip.villeDepart} → {trip.villeArrivee}
        </h3>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Conducteur:</strong>{" "}
              {user ? `${user.name} ${user.surname}` : trip.conductorId}
              {user && (
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  {user.rating}/5 - {user.totalTrips} trajets
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Départ:</strong>{" "}
              {new Date(trip.departureTime).toLocaleString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Point de rencontre:</strong> {trip.meetingPoint}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Véhicule:</strong> {trip.carModel}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Places disponibles:</strong> {trip.nbPlacesVides}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Prix:</strong>{" "}
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "#10b981",
                  fontWeight: "bold",
                }}
              >
                {trip.price}€
              </span>{" "}
              par personne
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div>
              <strong>Statut:</strong>{" "}
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  background:
                    trip.status === "available"
                      ? "#d1fae5"
                      : trip.status === "full"
                      ? "#fed7aa"
                      : "#fee2e2",
                  color:
                    trip.status === "available"
                      ? "#065f46"
                      : trip.status === "full"
                      ? "#92400e"
                      : "#991b1b",
                }}
              >
                {trip.status === "available"
                  ? "Disponible"
                  : trip.status === "full"
                  ? "Complet"
                  : trip.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Composant Calcul CO₂ */}
      <CarbonImpact
        departure={trip.villeDepart}
        arrival={trip.villeArrivee}
        passengers={4 - trip.nbPlacesVides + 1}
      />

      {/* Section Réservation */}
      <div className="card">
        <h3>Réserver ce trajet</h3>

        {!showReservationForm ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <p style={{ marginBottom: 16, color: "#6b7280" }}>
              Places disponibles: <strong>{trip.nbPlacesVides}</strong>
            </p>
            <button
              onClick={() => setShowReservationForm(true)}
              disabled={trip.nbPlacesVides === 0}
              style={{
                padding: "12px 32px",
                fontSize: "1.1rem",
                background: trip.nbPlacesVides === 0 ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: trip.nbPlacesVides === 0 ? "not-allowed" : "pointer",
              }}
            >
              {trip.nbPlacesVides === 0 ? "Complet" : "Je réserve !"}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleReservation}
            style={{ display: "grid", gap: 16 }}
          >
            {/* Informations du passager */}
            <div
              style={{ background: "#f3f4f6", padding: 16, borderRadius: 8 }}
            >
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>
                Vos informations
              </h4>

              <label style={{ display: "block", marginBottom: 12 }}>
                <strong>Nom complet *</strong>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                  placeholder="Jean Dupont"
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: "1rem",
                    marginTop: 8,
                    border: "2px solid #e5e7eb",
                    borderRadius: 8,
                  }}
                />
              </label>

              <label style={{ display: "block", marginBottom: 12 }}>
                <strong>Email *</strong>
                <input
                  type="email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                  placeholder="jean.dupont@email.com"
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: "1rem",
                    marginTop: 8,
                    border: "2px solid #e5e7eb",
                    borderRadius: 8,
                  }}
                />
              </label>

              <label style={{ display: "block", marginBottom: 0 }}>
                <strong>Téléphone *</strong>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  required
                  placeholder="06 12 34 56 78"
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: "1rem",
                    marginTop: 8,
                    border: "2px solid #e5e7eb",
                    borderRadius: 8,
                  }}
                />
              </label>
            </div>

            {/* Nombre de places */}
            <label>
              <strong>Nombre de places à réserver *</strong>
              <input
                type="number"
                min={1}
                max={trip.nbPlacesVides}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  fontSize: "1rem",
                  marginTop: 8,
                  border: "2px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
            </label>

            {/* Total */}
            <div
              style={{
                background: "#f3f4f6",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#6b7280",
                  marginBottom: 4,
                }}
              >
                Total à payer
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {trip.price * seats}€
              </div>
              <div
                style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}
              >
                {seats} place{seats > 1 ? "s" : ""} × {trip.price}€
              </div>
            </div>

            {/* Message de confirmation ou d'erreur */}
            {message && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: message.includes("confirmée") ? "#d1fae5" : "#fee2e2",
                  color: message.includes("confirmée") ? "#065f46" : "#991b1b",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}

            {/* Boutons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setShowReservationForm(false);
                  setMessage("");
                  setPassengerName("");
                  setPassengerEmail("");
                  setPassengerPhone("");
                }}
                disabled={booking}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: 8,
                  cursor: booking ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  opacity: booking ? 0.5 : 1,
                }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={booking}
                style={{
                  flex: 2,
                  padding: 12,
                  background: booking ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: booking ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {booking
                  ? "Réservation en cours..."
                  : "Confirmer la réservation"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bouton retour */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={() => navigate("/search", "")}
          style={{
            padding: "12px 24px",
            background: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Retour à la recherche
        </button>
      </div>
    </div>
  );
}
