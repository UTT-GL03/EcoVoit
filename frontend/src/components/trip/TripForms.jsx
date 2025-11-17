import { useState } from "react";

function TripForms() {
  const [formData, setFormData] = useState({
    departureCity: "",
    arrivalCity: "",
    departureDate: "",
    departureTime: "",
    availableSeats: 1,
    pricePerSeat: 0,
    description: "",
  });

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
