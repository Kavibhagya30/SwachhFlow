import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    truckNumber: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submit
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent reload

    // Save driver info for Dashboard use
    localStorage.setItem("driver", JSON.stringify(formData));

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Government Logo"
            className="gov-logo"
          />
          <h1>GHMC Driver's App</h1>
          <p>Government of Hyderabad</p>
        </div>

        {/* LOGIN FORM */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit mobile number"
            required
          />

          <label>Truck Number</label>
          <input
            type="text"
            name="truckNumber"
            placeholder="Eg: TS09 AB 1234"
            value={formData.truckNumber}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <a href="#">Help</a>
          <span> | </span>
          <a href="#">Privacy Policy</a>
        </div>

      </div>
    </div>
  );
}
