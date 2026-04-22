import { Routes, Route } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Routes>
        <Route path="/" element={<ResultsPage />} />
        <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
      </Routes>
    </>
  );
}
