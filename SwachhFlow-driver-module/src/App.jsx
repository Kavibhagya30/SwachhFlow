import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import RouteMap from "./Components/RouteMap";
import ProofUpload from "./Components/ProofUpload";
import Alerts from "./Components/Alerts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<RouteMap />} />
      <Route path="/proof" element={<ProofUpload />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  );
}
