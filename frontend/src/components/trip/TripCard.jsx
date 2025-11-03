import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function TripCard({ trip, user, onViewDetails }) {
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
    <div className={"card interactive trip-card"}>
      <Avatar
        src={user?.avatar}
        firstName={user?.name}
        lastName={user?.surname}
        size="md"
      />

      <div>
        <div className={"route"}>
          <span className={"city"}>{trip.villeDepart}</span>
          <span className={"arrow"}>→</span>
          <span className={"city"}>{trip.villeArrivee}</span>
        </div>

        <div className={"meta"}>
          <span>📅 {formatDate(trip.departureTime)}</span>
          <span>💺 {trip.nbPlacesVides} places</span>
          <span>🚗 {trip.carModel}</span>
          <Badge variant={getBadgeVariant(trip.status)}>
            {getStatusLabel(trip.status)}
          </Badge>
        </div>

        <div className={"meeting"}>
          📍 {trip.meetingPoint}
        </div>

        {user && (
          <div className={"user-info"}>
            <span className={"name"}>{user.name} {user.surname}</span>
            <span className={"rating"}>⭐ {user.rating.toFixed(1)}</span>
            <span className={"trips"}>({user.totalTrips} trajets)</span>
          </div>
        )}
      </div>

      <div className={"right"}>
        <div className={"price"}>{trip.price}€</div>
        <div className={"price-note"}>par personne</div>
        <Button variant="secondary" onClick={onViewDetails}>
          Voir détails
        </Button>
      </div>
    </div>
  );
}
