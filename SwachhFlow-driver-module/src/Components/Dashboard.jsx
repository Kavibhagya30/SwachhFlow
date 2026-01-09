import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [route, setRoute] = useState([]);
  const [mobile, setMobile] = useState("9999999900"); // Hardcoded driver for demo
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(null); // ID of GVP being uploaded

  useEffect(() => {
    fetchRoute();
  }, [mobile]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      // Backend expects mobile number to find assigned route
      const res = await axios.get(`http://localhost:8000/driver/route/${mobile}`);
      // res.data = { route_id, points: [ {type, id}, ...] }
      if (res.data.points) {
        setRoute(res.data.points);
      } else {
        setRoute([]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleUploadProof = async (item, file) => {
    if (!file) return;
    setUploading(item.id);

    // Create form data
    const formData = new FormData();
    // We need GVP ID (int) from DB. But route only has "id" string (Name).
    // The backend /gvps/verify needs gvp_id.
    // Ideally the route JSON should contain the numeric ID.
    // Since I can't easily change the seed json structure without re-running python logic which acts on Name...
    // I might need to lookup GVP ID by name on backend or here.
    // For now, I'll pass 'gvp_id' as 1 (dummy) if not found, or try to fetch full GVP list to map.
    // BETTER: The route points in DB should have ID.
    // Let's assume for this demo I need to fetch GVPs first to map name -> ID.

    // NOTE: For now, I will send the name as metadata or just fail if ID needed?
    // Let's fetch GVPs to find the ID.
    try {
      const gvpsRes = await axios.get("http://localhost:8000/gvps");
      const found = gvpsRes.data.find(g => g.gvp_name === item.id);

      if (!found) {
        alert("GVP not found in system record!");
        setUploading(null);
        return;
      }

      formData.append("gvp_id", found.gvp_id);
      formData.append("lat", found.latitude); // Simulating being at the location
      formData.append("lng", found.longitude);
      formData.append("file", file);

      const res = await axios.post("http://localhost:8000/gvps/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(res.data.status + ": " + res.data.reason);

    } catch (e) {
      console.error(e);
      alert("Upload failed");
    }
    setUploading(null);
  };

  return (
    <>
      <div className="top-nav">
        <div className="container nav-right">
          <span>Driver: {mobile}</span>
        </div>
      </div>

      <header className="main-header">
        <div className="container">
          <h1>GHMC Driver App</h1>
        </div>
      </header>

      <section className="gvp-section">
        <h2 className="gvp-title">My Assigned Route</h2>

        {loading && <p>Loading route...</p>}

        {!loading && route.length === 0 && <p>No active route found.</p>}

        <div className="gvp-list">
          {route.map((item, index) => (
            <div className="gvp-card" key={index} style={{ borderLeft: item.type === "GVP" ? "5px solid orange" : "5px solid blue" }}>
              <span className="gvp-name">
                {index + 1}. {item.id} <br />
                <small>{item.type}</small>
              </span>

              {item.type === "GVP" && (
                <div className="upload-section">
                  {uploading === item.id ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <label className="nav-link" style={{ cursor: "pointer", background: "#f0f0f0", padding: "5px", borderRadius: "5px" }}>
                        📷 Upload Proof
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUploadProof(item, e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
