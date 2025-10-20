// components/trip/TripDetailModal.jsx
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";

export default function TripDetailModal({ trip, user, onClose }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
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
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "2rem",
                    maxWidth: "600px",
                    width: "100%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981" }}>
                        Détails du trajet
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            color: "#6b7280",
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <Avatar src={user?.avatar} firstName={user?.name} lastName={user?.surname} size="md" />
                        <div>
                            <div style={{ fontWeight: "600" }}>{user?.name} {user?.surname}</div>
                            <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                                ⭐ {user?.rating.toFixed(1)} ({user?.totalTrips} trajets)
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                            {trip.villeDepart} → {trip.villeArrivee}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                            📅 {formatDate(trip.departureTime)} • 💺 {trip.nbPlacesVides} places • 🚗 {trip.carModel}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Point de rencontre</div>
                        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                            {trip.meetingPoint}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Prix</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>
                            {trip.price}€ par personne
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Statut</div>
                        <Badge variant={getBadgeVariant(trip.status)}>
                            {getStatusLabel(trip.status)}
                        </Badge>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#374151",
                            cursor: "pointer",
                        }}
                    >
                        Fermer
                    </button>
                    <button
                        onClick={() => alert("Réservation confirmée !")}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "none",
                            background: "#10b981",
                            color: "white",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Réserver
                    </button>
                </div>
            </div>
        </div>
    );
}
