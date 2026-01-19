import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Alert.css";

export default function AlertPage() {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driver"));

  const [selected, setSelected] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const options = [
    "Truck Failure",
    "Fuel insufficient",
    "Traffic delay",
    "Partial dealing",
  ];

  const handleSubmit = () => {
    if (!selected) return;
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard");
  };

  return (
    <div className="alert-root">
      {/* ===== NAVBAR ===== */}
      <div className="alert-navbar">
        <div>{driver?.name || "Name"}</div>
        <div>{driver?.truckNumber || "Truck Number"}</div>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="profile-img"
        />
      </div>

      {/* ===== BODY ===== */}
      <div className="alert-body">
        <button className="alert-title">Alerts</button>

        <div className="alert-options">
          {options.map((opt) => (
            <label
              key={opt}
              className={`alert-option ${
                selected === opt ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="alert"
                checked={selected === opt}
                onChange={() => setSelected(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <button
          className="submit-alert"
          disabled={!selected}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* ===== POPUP (ONLY WHEN showPopup = true) ===== */}
      {showPopup && (
        <div className="popup-backdrop">
          <div className="popup">
            <div className="popup-icon">✔</div>

            <h3 className="popup-title">Alert Submitted</h3>

            <p className="popup-text">
              Your alert has been successfully sent to the control room.
            </p>

            <button className="popup-btn" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
