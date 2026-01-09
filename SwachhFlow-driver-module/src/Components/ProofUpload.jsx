import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function ProofUpload() {
    const navigate = useNavigate();
    const location = useLocation();
    const gvp = location.state?.gvp;

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("CLEARED");
    const [criticalLevel, setCriticalLevel] = useState("LOW");
    const [uploading, setUploading] = useState(false);

    if (!gvp) return <div>Invalid Access</div>;

    const handleSubmit = async () => {
        if (!file) return alert("Please capture photo");
        setUploading(true);

        const formData = new FormData();
        formData.append("gvp_id", gvp.gvp_id);
        formData.append("lat", gvp.latitude); // Simulating being at location (or use GPS)
        formData.append("lng", gvp.longitude);
        formData.append("file", file);
        formData.append("status", status);
        if (status === "PARTIALLY") {
            formData.append("critical_level", criticalLevel);
        }

        try {
            const res = await axios.post("http://localhost:8000/gvps/verify", formData);
            if (res.data.status === "SUCCESS") {
                alert(res.data.reason);
                navigate("/map"); // Go back to map for next point
            } else {
                alert("Verification Failed: " + res.data.reason);
            }
        } catch (e) {
            console.error(e);
            alert("Error submitting proof");
        }
        setUploading(false);
    };

    return (
        <div className="proof-screen p-4">
            <h2>Verify Clearance</h2>
            <p>Location: {gvp.gvp_name}</p>

            <div className="form-group">
                <label>Capture Proof (Camera Only)</label>
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={e => setFile(e.target.files[0])}
                />
                {file && <p>Image captured!</p>}
            </div>

            <div className="form-group">
                <label>Status</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="CLEARED"
                            checked={status === "CLEARED"}
                            onChange={e => setStatus(e.target.value)}
                        /> Cleared
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            value="PARTIALLY"
                            checked={status === "PARTIALLY"}
                            onChange={e => setStatus(e.target.value)}
                        /> Partially Cleared
                    </label>
                </div>
            </div>

            {status === "PARTIALLY" && (
                <div className="form-group">
                    <label>Critical Level</label>
                    <select value={criticalLevel} onChange={e => setCriticalLevel(e.target.value)}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
            )}

            <button className="primary-btn full" disabled={uploading} onClick={handleSubmit}>
                {uploading ? "Verifying..." : "Submit Proof"}
            </button>
            <button className="text-btn" onClick={() => navigate("/map")}>Cancel</button>
        </div>
    );
}
