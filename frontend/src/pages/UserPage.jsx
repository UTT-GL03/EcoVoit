export default function UserPage({ data, params, navigate }) {
  const userId = params.get("user_id");

  const user = (data.users || []).find((u) => u._id === userId);

  if (!user) {
    return (
      <div>
        <h2>Utilisateur non trouvé</h2>
        <button onClick={() => navigate("/search", "")}>Retour</button>
      </div>
    );
  }

  const userTrips = (data.trips || []).filter((t) => t.conductorId === userId);

  return (
    <div>
      <h2>Profil utilisateur</h2>
      <img src={user.avatar} alt={user.name} width="100" />
      <p>
        <strong>
          {user.name} {user.surname}
        </strong>
      </p>
      <p>Email: {user.email}</p>
      <p>Téléphone: {user.phone}</p>
      <p>Note: ⭐ {user.rating}/5</p>
      <p>Trajets effectués: {user.totalTrips}</p>

      <h3>Trajets proposés ({userTrips.length})</h3>
      {userTrips.map((trip) => (
        <div key={trip._id}>
          <p>
            {trip.villeDepart} → {trip.villeArrivee}
          </p>
          <button onClick={() => navigate("/trip", `trip_id=${trip._id}`)}>
            Voir
          </button>
        </div>
      ))}

      <button onClick={() => navigate("/search", "")}>Retour</button>
    </div>
  );
}
