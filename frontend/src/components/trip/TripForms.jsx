import { useState } from "react";

function TripForms() {
  const [formData, setFormData] = useState({
    departureCity: "", // ville de départ
    arrivalCity: "", // ville d'arrivée
    departureDate: "", // date de départ
    departureTime: "", // heure de départ
    availableSeats: 1, // nombre de places
    pricePerSeat: 0, // prix par place
    description: "", // description du trajet
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du formulaire : ", formData);
  };

  return (
    <div className="trip-form-container">
      <h2>Proposer un trajet</h2>
      <form onSubmit={handleSubmit}></form>
    </div>
  );
}
export default TripForms;
