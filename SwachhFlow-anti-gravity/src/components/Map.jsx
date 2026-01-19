import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Map.css";

export default function Map() {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  // Dummy data
  const sourceAddress = "Dammaiguda Petrol Bunk, Hyderabad";
  const destinationAddress = "Yellareddyguda Graveyard, Hyderabad";

  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="map-root">
      {/* ================= NAVBAR ================= */}
      <div className="map-navbar">
        <div className="nav-left">{driver?.name || "Shanjay"}</div>
        <div className="nav-center">
          {driver?.truckNumber || "TS09 08 0980"}
        </div>
        <div className="nav-right">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="profile-img"
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="map-content">
        <h2 className="map-title">Locations</h2>

        {/* ================= MAP ================= */}
        <div className={`map-box ${mapLoaded ? "loaded" : ""}`}>
          {!mapLoaded && <div className="map-loader">Loading Map…</div>}
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=hyderabad&t=&z=12&output=embed"
            className="map-frame"
            onLoad={() => setMapLoaded(true)}
          />
        </div>

        {/* ================= ROUTE INFO ================= */}
        <div className="route-info">
          📍 Route: <strong>Source → Destination</strong>
        </div>

        {/* ================= SOURCE & DESTINATION ================= */}
        <div className="location-fields">
          <div className="location-row">
            <span className="label">Source</span>
            <input value={sourceAddress} disabled />
          </div>

          <div className="location-row">
            <span className="label">Destination</span>
            <input value={destinationAddress} disabled />
          </div>
        </div>

        {/* ================= UPLOAD PROOF ================= */}
        <div className="upload-section">
          <button
          className="upload-btn"
          onClick={() => navigate("/proof")}
        >
          Upload Proof
        </button>
        </div>
      </div>
    </div>
  );
}
