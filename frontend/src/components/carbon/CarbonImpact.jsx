import React from "react";
import {
  calculateCarbonFootprint,
  getEcoBadge,
} from "../../utils/carbonCalculator";

export default function CarbonImpact({ departure, arrival, passengers = 3 }) {
  const stats = calculateCarbonFootprint(departure, arrival, passengers);
  const badge = getEcoBadge(stats.savedTotal);

  return (
    <div className="carbon-impact-card">
      <h3 className="carbon-title">🌍 Impact Environnemental</h3>

      <div className="carbon-stats-grid">
        {/* Distance */}
        <div className="carbon-stat">
          <div className="stat-icon">📏</div>
          <div className="stat-value">{stats.distance} km</div>
          <div className="stat-label">Distance</div>
        </div>

        {/* CO₂ seul */}
        <div className="carbon-stat warning">
          <div className="stat-icon">🚗</div>
          <div className="stat-value">{stats.aloneTotal} kg</div>
          <div className="stat-label">Si seul ({passengers} voitures)</div>
        </div>

        {/* CO₂ covoiturage */}
        <div className="carbon-stat success">
          <div className="stat-icon">🚗👥</div>
          <div className="stat-value">{stats.carpoolPerPerson} kg</div>
          <div className="stat-label">En covoiturage/pers.</div>
        </div>

        {/* CO₂ économisé */}
        <div className="carbon-stat highlight">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.savedTotal} kg</div>
          <div className="stat-label">CO₂ économisé</div>
        </div>
      </div>

      {/* Badge écologique */}
      <div className="eco-badge" style={{ borderColor: badge.color }}>
        <span className="badge-emoji" style={{ fontSize: "2rem" }}>
          {badge.emoji}
        </span>
        <div>
          <div className="badge-level" style={{ color: badge.color }}>
            Badge {badge.level}
          </div>
          <div className="badge-text">
            Vous économisez l'équivalent de {stats.treeDays} jours d'absorption
            d'un arbre ! 🌳
          </div>
        </div>
      </div>

      {/* Comparaison train */}
      <div className="carbon-comparison">
        <div className="comparison-title">📊 Comparaison</div>
        <div className="comparison-row">
          <span>🚂 En train :</span>
          <span className="comparison-value">{stats.trainTotal} kg CO₂</span>
        </div>
        <div className="comparison-row">
          <span>🚗 En covoiturage :</span>
          <span className="comparison-value">{stats.carpoolTotal} kg CO₂</span>
        </div>
        {stats.vsTrainSavings > 0 ? (
          <div className="comparison-note warning">
            ⚠️ Le train émet {Math.abs(stats.vsTrainSavings)} kg de moins
          </div>
        ) : (
          <div className="comparison-note success">
            ✅ Aussi écologique que le train !
          </div>
        )}
      </div>
    </div>
  );
}
