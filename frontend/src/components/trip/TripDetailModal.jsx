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
        <div className={"modal-backdrop"} onClick={onClose}>
            <div className={"modal-content"} onClick={(e) => e.stopPropagation()}>
                <div className={"modal-header"}>
                    <h2 className={"modal-title"}>Détails du trajet</h2>
                    <button className={"modal-close"} onClick={onClose}>×</button>
                </div>

                <div className={"modal-section"}>
                    <div className={"avatar-row"}>
                        <Avatar src={user?.avatar} firstName={user?.name} lastName={user?.surname} size="md" />
                        <div>
                            <div className={"section-heading"}>{user?.name} {user?.surname}</div>
                            <div className={"muted"}>
                                ⭐ {user?.rating.toFixed(1)} ({user?.totalTrips} trajets)
                            </div>
                        </div>
                    </div>

                    <div className={"modal-section"}>
                        <div className={"route-title"}>
                            {trip.villeDepart} → {trip.villeArrivee}
                        </div>
                        <div className={"muted"}>
                            📅 {formatDate(trip.departureTime)} • 💺 {trip.nbPlacesVides} places • 🚗 {trip.carModel}
                        </div>
                    </div>

                    <div className={"modal-section"}>
                        <div className={"section-heading"}>Point de rencontre</div>
                        <div className={"muted"}>{trip.meetingPoint}</div>
                    </div>

                    <div className={"modal-section"}>
                        <div className={"section-heading"}>Prix</div>
                        <div className={"price"}>{trip.price}€ par personne</div>
                    </div>

                    <div className={"modal-section"}>
                        <div className={"section-heading"}>Statut</div>
                        <Badge variant={getBadgeVariant(trip.status)}>
                            {getStatusLabel(trip.status)}
                        </Badge>
                    </div>
                </div>

                <div className={"modal-actions"}>
                    <button className={"btn btn-secondary"} onClick={onClose}>Fermer</button>
                    <button className={"btn btn-primary"} onClick={() => alert("Réservation confirmée !")}>Réserver</button>
                </div>
            </div>
        </div>
    );
}
