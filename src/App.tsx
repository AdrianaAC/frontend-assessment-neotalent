import { Routes, Route } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ResultsPage />} />
      <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
    </Routes>
  );
}
