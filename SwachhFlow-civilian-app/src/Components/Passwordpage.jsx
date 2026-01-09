import "./Password.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function Passwordpage() {
  const location = useLocation();
  const navigate = useNavigate();

  const mobile = location.state?.mobile; 

  const [mpin, setMpin] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleValidate = () => {
    if (mpin.join("").length !== 4) {
      alert("Enter 4-digit MPIN");
      return;
    }

    navigate("/dashboard", {
      state: { mobile },
    });
  };

  return (
    <div className="page">
      <div className="top-card">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/2/2d/GHMC_logo.png"
          className="ghmc-logo"
        />
        <h2>MyGHMC Citizen App</h2>
        <p>Government of Telangana</p>
      </div>

      <div className="mpin-card">
        <h3>MPIN</h3>
        <p>Enter 4-Digit MPIN</p>

        <div className="mpin-inputs">
          {mpin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>

        <button className="validate-btn" onClick={handleValidate}>
          Validate
        </button>
      </div>
    </div>
  );
}
