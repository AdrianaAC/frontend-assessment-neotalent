export type VehicleSpecification = {
  vehicleType: string;
  colour: string;
  fuel: string;
  transmission: string;
  numberOfDoors: number;
  co2Emissions: string;
  noxEmissions: string;
  numberOfKeys: number;
};

export type VehicleOwnership = {
  logbook: string;
  numberOfOwners: number;
  dateOfRegistration: string;
};

export type VehicleDetails = {
  specification: VehicleSpecification;
  ownership: VehicleOwnership;
  equipment: string[];
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  engineSize: string;
  fuelType: string;
  year: number;
  mileage: number;
  auctionDateTime: string;
  startingBid: number;
  favourite: boolean;
  details: VehicleDetails;
};

export type SortField = "make" | "startingBid" | "mileage" | "auctionDateTime";
export type SortDirection = "asc" | "desc";

export type Filters = {
  make: string;
  model: string;
  minBid: string;
  maxBid: string;
  favouritesOnly: boolean;
};
