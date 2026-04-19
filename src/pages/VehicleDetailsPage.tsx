import { Link, useParams } from "react-router-dom";
import { useVehicles } from "../context/VehicleContext";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
} from "../utils/format";

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const { vehicles, toggleFavourite } = useVehicles();
  const vehicle = vehicles.find((item) => item.id === id);

  if (!vehicle) {
    return (
      <main className="page">
        <p>Vehicle not found.</p>
        <Link to="/">Back to results</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/" className="back-link">
        Back to results
      </Link>

      <div className="details-card">
        <div className="vehicle-card__image details-image">
          <div className="vehicle-card__image-overlay">
            <span className="vehicle-card__image-label">Image placeholder</span>
          </div>
        </div>

        <div className="details-card__body">
          <div className="details-card__intro">
            <div>
              <p className="vehicle-card__eyebrow">{vehicle.make}</p>
              <h1>
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="details-card__subtitle">
                {vehicle.year} | {vehicle.engineSize} | {vehicle.fuelType}
              </p>
            </div>

            <button
              type="button"
              className={`favourite-btn details-favourite-btn${vehicle.favourite ? " favourite-btn--active" : ""}`}
              onClick={() => toggleFavourite(vehicle.id)}
            >
              {vehicle.favourite
                ? "Remove from favourites"
                : "Add to favourites"}
            </button>
          </div>

          <dl className="details-summary-grid">
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
              <dt>Favourite</dt>
              <dd>{vehicle.favourite ? "Saved" : "Not saved"}</dd>
            </div>
          </dl>

          <section className="details-section">
            <h2>Specification</h2>
            <dl className="details-data-grid">
              <div>
                <dt>Vehicle Type</dt>
                <dd>{vehicle.details.specification.vehicleType}</dd>
              </div>
              <div>
                <dt>Colour</dt>
                <dd>{vehicle.details.specification.colour}</dd>
              </div>
              <div>
                <dt>Fuel</dt>
                <dd>{vehicle.details.specification.fuel}</dd>
              </div>
              <div>
                <dt>Transmission</dt>
                <dd>{vehicle.details.specification.transmission}</dd>
              </div>
              <div>
                <dt>Number Of Doors</dt>
                <dd>{vehicle.details.specification.numberOfDoors}</dd>
              </div>
              <div>
                <dt>CO2 Emissions</dt>
                <dd>{vehicle.details.specification.co2Emissions}</dd>
              </div>
              <div>
                <dt>NOX Emissions</dt>
                <dd>{vehicle.details.specification.noxEmissions}</dd>
              </div>
              <div>
                <dt>Number Of Keys</dt>
                <dd>{vehicle.details.specification.numberOfKeys}</dd>
              </div>
            </dl>
          </section>

          <section className="details-section">
            <h2>Ownership</h2>
            <dl className="details-data-grid">
              <div>
                <dt>Logbook</dt>
                <dd>{vehicle.details.ownership.logbook}</dd>
              </div>
              <div>
                <dt>Number Of Owners</dt>
                <dd>{vehicle.details.ownership.numberOfOwners}</dd>
              </div>
              <div>
                <dt>Date Of Registration</dt>
                <dd>{vehicle.details.ownership.dateOfRegistration}</dd>
              </div>
            </dl>
          </section>

          <section className="details-section">
            <h2>Equipment</h2>
            <ul className="equipment-list">
              {vehicle.details.equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
