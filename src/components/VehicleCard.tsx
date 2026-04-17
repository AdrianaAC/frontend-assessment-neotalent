import { Link } from "react-router-dom";
import type { Vehicle } from "../types/vehicle";
import { getTimeUntilAuction } from "../utils/date";

type Props = {
  vehicle: Vehicle;
  onToggleFavourite: (id: string) => void;
};

export default function VehicleCard({ vehicle, onToggleFavourite }: Props) {
  const { days, hours } = getTimeUntilAuction(vehicle.auctionDateTime);

  return (
    <div className="vehicle-card">
      <Link to={`/vehicle/${vehicle.id}`} className="vehicle-card__link">
        <div className="vehicle-card__image">
          <span>Image placeholder</span>
        </div>

        <div className="vehicle-card__content">
          <h2>
            {vehicle.make} {vehicle.model}
          </h2>

          <p>
            <strong>Year:</strong> {vehicle.year}
          </p>
          <p>
            <strong>Engine:</strong> {vehicle.engineSize}
          </p>
          <p>
            <strong>Fuel:</strong> {vehicle.fuelType}
          </p>
          <p>
            <strong>Mileage:</strong> {vehicle.mileage.toLocaleString()}
          </p>
          <p>
            <strong>Starting Bid:</strong> £{vehicle.startingBid.toLocaleString()}
          </p>
          <p>
            <strong>Auction:</strong>{" "}
            {new Date(vehicle.auctionDateTime).toLocaleString()}
          </p>
          <p>
            <strong>Starts in:</strong> {days} days, {hours} hours
          </p>
        </div>
      </Link>

      <button
        type="button"
        className="favourite-btn"
        onClick={() => onToggleFavourite(vehicle.id)}
        aria-label={
          vehicle.favourite ? "Remove from favourites" : "Add to favourites"
        }
      >
        {vehicle.favourite ? "★ Favourite" : "☆ Favourite"}
      </button>
    </div>
  );
}