import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Reports from "./Components/Report";
import Map from "./Components/Map";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/maps" element={<Map />} />
    </Routes>
  );
}
