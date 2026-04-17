import type { Filters, Vehicle } from "../types/vehicle";

export function filterVehicles(vehicles: Vehicle[], filters: Filters) {
  return vehicles.filter((vehicle) => {
    const matchesMake =
      !filters.make ||
      vehicle.make.toLowerCase() === filters.make.toLowerCase();

    const matchesModel =
      !filters.model ||
      vehicle.model.toLowerCase().includes(filters.model.toLowerCase());

    const minBid = filters.minBid ? Number(filters.minBid) : null;
    const maxBid = filters.maxBid ? Number(filters.maxBid) : null;

    const matchesMinBid = minBid === null || vehicle.startingBid >= minBid;
    const matchesMaxBid = maxBid === null || vehicle.startingBid <= maxBid;

    const matchesFavourite =
      !filters.favouritesOnly || vehicle.favourite === true;

    return (
      matchesMake &&
      matchesModel &&
      matchesMinBid &&
      matchesMaxBid &&
      matchesFavourite
    );
  });
}