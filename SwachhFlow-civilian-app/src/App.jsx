import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Service from "./Components/service";
import Login from "./Components/LoginPage";
import Passwordpage from "./Components/Passwordpage";
import Locations from "./Components/Location";
import GvpPoints from "./Components/GvpPoints";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/password" element={<Passwordpage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Service />} />
      <Route path="/locations" element={<Locations />} /> {/* ✅ ADD THIS */}
      <Route path="/gvp-points" element={<GvpPoints />} />
    </Routes>
  );
}
