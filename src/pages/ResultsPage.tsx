import { useMemo, useState } from "react";
import VehicleCard from "../components/VehicleCard";
import vehiclesData from "../data/vehicles.json";
import type { Vehicle } from "../types/vehicle";

function normalizeVehicles(data: Omit<Vehicle, "id">[]): Vehicle[] {
  return data.map((vehicle, index) => ({
    ...vehicle,
    id: `${vehicle.make}-${vehicle.model}-${vehicle.year}-${index}`,
  }));
}

export default function ResultsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    normalizeVehicles(vehiclesData as Omit<Vehicle, "id">[])
  );

  const totalVehicles = useMemo(() => vehicles.length, [vehicles]);

  function handleToggleFavourite(id: string) {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, favourite: !vehicle.favourite }
          : vehicle
      )
    );
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Vehicle Results</h1>
        <p>{totalVehicles} vehicles available</p>
      </header>

      <section className="vehicle-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onToggleFavourite={handleToggleFavourite}
          />
        ))}
      </section>
    </main>
  );
}