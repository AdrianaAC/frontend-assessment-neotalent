import type { Vehicle } from "../types/vehicle";

function slugifyPart(value: string | number) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateVehicleId(vehicle: Omit<Vehicle, "id">) {
  return [
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.mileage,
    vehicle.startingBid,
    vehicle.auctionDateTime,
  ]
    .map(slugifyPart)
    .join("-");
}
