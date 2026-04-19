import { Link } from "react-router-dom";
import type { Vehicle } from "../types/vehicle";
import { getAuctionCountdownLabel } from "../utils/date";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
} from "../utils/format";

type Props = {
  vehicle: Vehicle;
  onToggleFavourite: (id: string) => void;
};

export default function VehicleCard({ vehicle, onToggleFavourite }: Props) {
  const auctionCountdown = getAuctionCountdownLabel(vehicle.auctionDateTime);

  return (
    <div className="vehicle-card">
      <Link to={`/vehicle/${vehicle.id}`} className="vehicle-card__link">
        <div className="vehicle-card__image">
          <div className="vehicle-card__image-overlay">
            <span className="vehicle-card__image-label">Image placeholder</span>
            <span className="vehicle-card__countdown">{auctionCountdown}</span>
          </div>
        </div>

        <div className="vehicle-card__content">
          <div className="vehicle-card__header">
            <div>
              <p className="vehicle-card__eyebrow">{vehicle.make}</p>
              <h2>
                {vehicle.make} {vehicle.model}
              </h2>
            </div>
            {vehicle.favourite ? (
              <span className="vehicle-card__badge">Favourite</span>
            ) : null}
          </div>

          <div className="vehicle-card__meta">
            <span>{vehicle.year}</span>
            <span>{vehicle.engineSize}</span>
            <span>{vehicle.fuelType}</span>
          </div>

          <dl className="vehicle-card__stats">
            <div>
              <dt>Starting bid</dt>
              <dd>{formatCurrency(vehicle.startingBid)}</dd>
            </div>
            <div>
              <dt>Mileage</dt>
              <dd>{formatNumber(vehicle.mileage)} mi</dd>
            </div>
            <div>
              <dt>Auction date</dt>
              <dd>{formatDateTime(vehicle.auctionDateTime)}</dd>
            </div>
            <div>
              <dt>Starts in</dt>
              <dd>{auctionCountdown}</dd>
            </div>
          </dl>
        </div>
      </Link>

      <button
        type="button"
        className={`favourite-btn${vehicle.favourite ? " favourite-btn--active" : ""}`}
        onClick={() => onToggleFavourite(vehicle.id)}
        aria-label={
          vehicle.favourite ? "Remove from favourites" : "Add to favourites"
        }
      >
        {vehicle.favourite ? "Saved to favourites" : "Save to favourites"}
      </button>
    </div>
  );
}
