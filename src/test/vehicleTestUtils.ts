import type { Vehicle } from "../types/vehicle";

export function buildVehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    id: overrides.id ?? "vehicle-id",
    make: overrides.make ?? "Ford",
    model: overrides.model ?? "Fiesta",
    engineSize: overrides.engineSize ?? "1.0L",
    fuelType: overrides.fuelType ?? "Petrol",
    year: overrides.year ?? 2020,
    mileage: overrides.mileage ?? 10000,
    auctionDateTime: overrides.auctionDateTime ?? "2026-04-25T10:00:00",
    startingBid: overrides.startingBid ?? 10000,
    favourite: overrides.favourite ?? false,
    details: overrides.details ?? {
      specification: {
        vehicleType: "Hatchback",
        colour: "Blue",
        fuel: "Petrol",
        transmission: "Manual",
        numberOfDoors: 5,
        co2Emissions: "110 g/km",
        noxEmissions: "0.02 g/km",
        numberOfKeys: 2,
      },
      ownership: {
        logbook: "Yes",
        numberOfOwners: 1,
        dateOfRegistration: "2020-01-01",
      },
      equipment: ["Bluetooth", "Air Conditioning"],
    },
  };
}
