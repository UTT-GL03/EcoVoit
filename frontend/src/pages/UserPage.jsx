import React from "react";

export default function UserPage({ data, params, navigate }) {
  const userId = params.get("user_id");
  const user = (data.users || []).find((u) => u.id === userId);
  if (!user) return <div>Utilisateur non trouvé</div>;

  const userTrips = (data.trips || []).filter((t) => t.conductorId === userId);

  return (
    <div>
      <h2>
        Profil de {user.name} {user.surname}
      </h2>
      <p>Email: {user.email}</p>
      <p>Téléphone: {user.phone}</p>
      <p>Trajets proposés: {user.totalTrips}</p>

      <h3>Trajets</h3>
      <ul>
        {userTrips.map((t) => (
          <li key={t.id}>
            {t.villeDepart} → {t.villeArrivee} —{" "}
            {new Date(t.departureTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
