import type { SortDirection, SortField, Vehicle } from "../types/vehicle";

export function sortVehicles(
  vehicles: Vehicle[],
  field: SortField,
  direction: SortDirection
) {
  const sorted = [...vehicles].sort((a, b) => {
    switch (field) {
      case "make":
        return a.make.localeCompare(b.make);
      case "startingBid":
        return a.startingBid - b.startingBid;
      case "mileage":
        return a.mileage - b.mileage;
      case "auctionDateTime":
        return (
          new Date(a.auctionDateTime).getTime() -
          new Date(b.auctionDateTime).getTime()
        );
      default:
        return 0;
    }
  });

  return direction === "asc" ? sorted : sorted.reverse();
}