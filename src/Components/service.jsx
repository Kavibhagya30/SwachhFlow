import "./Service.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Service() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "9876543210";

  const services = [
    "Idea Box",
    "LRS",
    "Birth Certificate",
    "Death Certificate",
    "Grievances",
    "Civilian service",
  ];

  const handleServiceClick = (service) => {
    if (service === "Civilian service") {
      navigate("/locations");
    }
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="top-nav">
          <span className="menu-icon" onClick={() => navigate(-1)}>
            ←
          </span>
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
        <h3 className="service-title">Services</h3>

        <div className="service-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => handleServiceClick(service)}
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
