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
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "1.5rem",
        alignItems: "center",
        border: "2px solid transparent",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        e.currentTarget.style.borderColor = "#10b981";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <Avatar
        src={user?.avatar}
        firstName={user?.name}
        lastName={user?.surname}
        size="md"
      />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            {trip.villeDepart}
          </span>
          <span style={{ color: "#9ca3af" }}>→</span>
          <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>
            {trip.villeArrivee}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span>📅 {formatDate(trip.departureTime)}</span>
          <span>💺 {trip.nbPlacesVides} places</span>
          <span>🚗 {trip.carModel}</span>
          <Badge variant={getBadgeVariant(trip.status)}>
            {getStatusLabel(trip.status)}
          </Badge>
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginBottom: "0.5rem",
          }}
        >
          📍 {trip.meetingPoint}
        </div>

        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ fontWeight: "500" }}>
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

      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#10b981",
            marginBottom: "0.5rem",
          }}
        >
          {trip.price}€
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginBottom: "0.75rem",
          }}
        >
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
