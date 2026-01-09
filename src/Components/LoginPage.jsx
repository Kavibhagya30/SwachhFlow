import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");

  const handleLogin = () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    navigate("/password", {
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

      <div className="login-card">
        <h3 className="login-title">LOGIN</h3>

        <input
          type="text"
          placeholder="Mobile Number"
          className="input-box"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    </div>
  );
}
