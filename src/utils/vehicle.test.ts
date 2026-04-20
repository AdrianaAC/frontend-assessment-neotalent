import { describe, expect, it } from "vitest";
import { generateVehicleId } from "./vehicle";

describe("generateVehicleId", () => {
  it("creates deterministic ids from stable vehicle fields", () => {
    const vehicle = {
      make: "BMW",
      model: "320d",
      engineSize: "2.0L",
      fuelType: "Diesel",
      year: 2019,
      mileage: 45000,
      auctionDateTime: "2026-04-20T12:00:00",
      startingBid: 12000,
      favourite: false,
      details: {
        specification: {
          vehicleType: "Saloon",
          colour: "Black",
          fuel: "Diesel",
          transmission: "Automatic",
          numberOfDoors: 4,
          co2Emissions: "120 g/km",
          noxEmissions: "0.03 g/km",
          numberOfKeys: 2,
        },
        ownership: {
          logbook: "Yes",
          numberOfOwners: 2,
          dateOfRegistration: "2019-06-15",
        },
        equipment: ["Air Conditioning"],
      },
    };

    expect(generateVehicleId(vehicle)).toBe(
      "bmw-320d-2019-45000-12000-2026-04-20t12-00-00"
    );
  });

  it("does not depend on array position", () => {
    const vehicle = {
      make: "Audi",
      model: "A3",
      engineSize: "1.6L",
      fuelType: "Petrol",
      year: 2018,
      mileage: 60000,
      auctionDateTime: "2026-04-22T15:30:00",
      startingBid: 9000,
      favourite: true,
      details: {
        specification: {
          vehicleType: "Hatchback",
          colour: "White",
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
          dateOfRegistration: "2018-03-10",
        },
        equipment: ["Cruise Control"],
      },
    };

    expect(generateVehicleId(vehicle)).toBe(generateVehicleId(vehicle));
  });
});
