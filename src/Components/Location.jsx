import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Service.css";
import "./Location.css"; // locate button styles

export default function Locations() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "9876543210";

  const [address, setAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  // 🔵 SHOW MAP PREVIEW (NEW)
  const handleLocate = () => {
    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    const encodedAddress = encodeURIComponent(address);
    setMapUrl(`https://www.google.com/maps?q=${encodedAddress}&output=embed`);
  };

  // 🔵 GO TO NEXT PAGE (EXISTING)
  const handleSubmit = () => {
    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    navigate("/gvp-points", {
      state: { address },
    });
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="top-nav">
          <span className="menu-icon" onClick={() => navigate(-1)}>←</span>
          <span className="nav-title">GHMC CITIZEN APP</span>
        </div>

        <div className="header-body">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/2/2d/GHMC_logo.png"
            className="dashboard-logo"
            alt="GHMC"
          />
          <p className="mobile-number">{mobile}</p>
        </div>

        <div className="header-footer">
          <span>02-01-2026</span>
          <span>V: 6.4</span>
        </div>
      </header>

      {/* CONTENT */}
      <div className="dashboard-box">
        <h3 className="service-title">Locations</h3>

        {/* MAP (SAME AS OLD PAGE) */}
        <div className="map-container">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              title="Map"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <p className="map-placeholder">
              Enter address to view location on map
            </p>
          )}
        </div>

        {/* ADDRESS INPUT */}
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="address-input"
        />

        {/* LOCATE BUTTON (NEW) */}
        <button className="locate-btn" onClick={handleLocate}>
          Locate on Map
        </button>

        {/* SUBMIT BUTTON */}
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
