import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Map from "./components/Map";
import Proof from "./components/Proof";
import AlertPage from "./components/Alert";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/maps" element={<Map />} />
      <Route path="/proof" element={<Proof />} />
      <Route path="/alert" element={<AlertPage />} />
    </Routes>
  );
}
