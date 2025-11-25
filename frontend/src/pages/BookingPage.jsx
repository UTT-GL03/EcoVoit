export default function BookingPage({ data, params, navigate }) {
  const tripId = params.get("trip_id");

  // CORRECTION: Utiliser _id
  const trip = (data.trips || []).find((t) => t._id === tripId);

  if (!trip) {
    return (
      <div>
        <h2>Trajet non trouvé</h2>
        <button onClick={() => navigate("/search", "")}>Retour</button>
      </div>
    );
  }

  const handleBooking = () => {
    alert(
      `Réservation confirmée pour ${trip.villeDepart} → ${trip.villeArrivee}`
    );
    navigate("/search", "");
  };

  return (
    <div>
      <h2>Réserver un trajet</h2>
      <p>
        <strong>
          {trip.villeDepart} → {trip.villeArrivee}
        </strong>
      </p>
      <p>Prix: {trip.price}€</p>
      <p>Places disponibles: {trip.nbPlacesVides}</p>

      <button onClick={handleBooking}>Confirmer la réservation</button>
      <button
        onClick={() => navigate("/trip", `trip_id=${trip._id}`)}
        style={{ marginLeft: "10px" }}
      >
        Retour
      </button>
    </div>
  );
}
