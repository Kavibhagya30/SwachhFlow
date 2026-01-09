import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Proof.css";

export default function Proof() {
  const driver = JSON.parse(localStorage.getItem("driver"));
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = () => {
    setShowPopup(true);
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    navigate("/dashboard");
  };

  return (
    <div className="proof-root">

      {/* ===== NAVBAR ===== */}
      <div className="proof-navbar">
        <div className="nav-left">{driver?.name || "Shanjay"}</div>
        <div className="nav-center">{driver?.truckNumber || "TS09 09876"}</div>
        <div className="nav-right">
          <img src="https://i.pravatar.cc/40" alt="profile" className="profile-img" />
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="proof-body">

        {/* CAMERA */}
        <div className="camera-card">
          {photo ? (
            <>
              <img src={photo} alt="Captured" />
              <button className="remove-photo" onClick={removePhoto}>✕</button>
            </>
          ) : (
            <div className="camera-icon">
              📷
              <span>No photo selected</span>
            </div>
          )}
        </div>

        <button className="click-photo-btn" onClick={() => fileInputRef.current.click()}>
          Click Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handlePhotoCapture}
        />

        {/* STATUS */}
        <div className="status-section">
          <h3>Status</h3>

          <div className="status-options">
            <div
              className={`status-card green ${status === "Cleared" ? "active" : ""}`}
              onClick={() => setStatus("Cleared")}
            >
              <span className="dot green-dot"></span>
              <span className="status-text">Cleared</span>
            </div>

            <div
              className={`status-card yellow ${status === "Partially Cleared" ? "active" : ""}`}
              onClick={() => setStatus("Partially Cleared")}
            >
              <span className="dot yellow-dot"></span>
              <span className="status-text">Partially Cleared</span>
            </div>

            <div
              className={`status-card red ${status === "Not Cleared" ? "active" : ""}`}
              onClick={() => setStatus("Not Cleared")}
            >
              <span className="dot red-dot"></span>
              <span className="status-text">Not Cleared</span>
            </div>
          </div>
        </div>

        <button
          className="submit-btn"
          disabled={!photo || !status}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* ===== CENTER POPUP ===== */}
      {showPopup && (
        <div className="popup-backdrop">
          <div className="popup-box">
            <h3>✅ Successfully Submitted</h3>
            <p>Your inspection details were submitted.</p>
            <button onClick={handlePopupOk}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
