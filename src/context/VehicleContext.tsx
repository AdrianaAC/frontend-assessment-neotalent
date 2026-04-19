import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import vehiclesData from "../data/vehicles.json";
import type { Vehicle } from "../types/vehicle";

type VehicleContextValue = {
  vehicles: Vehicle[];
  toggleFavourite: (id: string) => void;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

function normalizeVehicles(data: Omit<Vehicle, "id">[]): Vehicle[] {
  return data.map((vehicle, index) => ({
    ...vehicle,
    id: `${vehicle.make}-${vehicle.model}-${vehicle.year}-${index}`,
  }));
}

type VehicleProviderProps = {
  children: ReactNode;
  initialVehicles?: Vehicle[];
};

export function VehicleProvider({
  children,
  initialVehicles,
}: VehicleProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    initialVehicles ?? normalizeVehicles(vehiclesData as Omit<Vehicle, "id">[])
  );

  function toggleFavourite(id: string) {
    setVehicles((currentVehicles) =>
      currentVehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, favourite: !vehicle.favourite }
          : vehicle
      )
    );
  }

  const value = useMemo(
    () => ({
      vehicles,
      toggleFavourite,
    }),
    [vehicles]
  );

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error("useVehicles must be used within a VehicleProvider");
  }

  return context;
}
