import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function TripCard({ trip, user }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeVariant = (status) => {
    const variants = {
      available: "success",
      full: "warning",
      cancelled: "danger",
      completed: "info",
    };
    return variants[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labels = {
      available: "Disponible",
      full: "Complet",
      cancelled: "Annulé",
      completed: "Terminé",
    };
    return labels[status] || status;
  };

  return (
    <div className="trip-card">
      <Avatar
        src={user?.avatar}
        firstName={user?.name}
        lastName={user?.surname}
        size="md"
      />

      <div>
        <div className="trip-title">
          <span>{trip.villeDepart}</span>
          <span style={{ color: "#9ca3af" }}>→</span>
          <span>{trip.villeArrivee}</span>
        </div>

        <div className="trip-meta">
          <span>📅 {formatDate(trip.departureTime)}</span>
          <span>💺 {trip.nbPlacesVides} places</span>
          <span>🚗 {trip.carModel}</span>
          <Badge variant={getBadgeVariant(trip.status)}>
            {getStatusLabel(trip.status)}
          </Badge>
        </div>

        <div className="meeting-point">
          📍 {trip.meetingPoint}
        </div>

        {user && (
          <div className="trip-meta">
            <span>
              {user.name} {user.surname}
            </span>
            <span style={{ color: "#fbbf24" }}>
              ⭐ {user.rating.toFixed(1)}
            </span>
            <span style={{ color: "#6b7280" }}>
              ({user.totalTrips} trajets)
            </span>
          </div>
        )}
      </div>

      <div className="price">
        <div className="price-value">
          {trip.price}€
        </div>
        <div className="price-note">
          par personne
        </div>
        <Button
          variant="secondary"
          onClick={() => alert(`Voir détails du trajet ${trip.id}`)}
        >
          Voir détails
        </Button>
      </div>
    </div>
  );
}
