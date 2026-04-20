import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import vehiclesData from "../data/vehicles.json";
import type { Vehicle } from "../types/vehicle";
import { generateVehicleId } from "../utils/vehicle";

type VehicleContextValue = {
  vehicles: Vehicle[];
  toggleFavourite: (id: string) => void;
};

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);
const FAVOURITES_STORAGE_KEY = "neotalent-vehicle-favourites";

function normalizeVehicles(data: Omit<Vehicle, "id">[]): Vehicle[] {
  return data.map((vehicle) => ({
    ...vehicle,
    id: generateVehicleId(vehicle),
  }));
}

function loadFavouriteIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const rawValue = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);

    if (!rawValue) {
      return new Set<string>();
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue)
      ? new Set(parsedValue.filter((value): value is string => typeof value === "string"))
      : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function applyPersistedFavourites(vehicles: Vehicle[]) {
  const favouriteIds = loadFavouriteIds();

  return vehicles.map((vehicle) => ({
    ...vehicle,
    favourite: favouriteIds.has(vehicle.id) ? true : vehicle.favourite,
  }));
}

type VehicleProviderProps = {
  children: ReactNode;
  initialVehicles?: Vehicle[];
  persistFavourites?: boolean;
};

export function VehicleProvider({
  children,
  initialVehicles,
  persistFavourites = initialVehicles === undefined,
}: VehicleProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    persistFavourites
      ? applyPersistedFavourites(
          initialVehicles ?? normalizeVehicles(vehiclesData as Omit<Vehicle, "id">[])
        )
      : initialVehicles ?? normalizeVehicles(vehiclesData as Omit<Vehicle, "id">[])
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

  useEffect(() => {
    if (!persistFavourites || typeof window === "undefined") {
      return;
    }

    const favouriteIds = vehicles
      .filter((vehicle) => vehicle.favourite)
      .map((vehicle) => vehicle.id);

    window.localStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(favouriteIds)
    );
  }, [persistFavourites, vehicles]);

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

export function getFavouritesStorageKey() {
  return FAVOURITES_STORAGE_KEY;
}
