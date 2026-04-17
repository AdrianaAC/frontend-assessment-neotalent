import { Link, useParams } from "react-router-dom";
import vehiclesData from "../data/vehicles.json";
import type { Vehicle } from "../types/vehicle";

function normalizeVehicles(data: Omit<Vehicle, "id">[]): Vehicle[] {
  return data.map((vehicle, index) => ({
    ...vehicle,
    id: `${vehicle.make}-${vehicle.model}-${vehicle.year}-${index}`,
  }));
}

export default function VehicleDetailsPage() {
  const { id } = useParams();

  const vehicles = normalizeVehicles(vehiclesData as Omit<Vehicle, "id">[]);
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
      <Link to="/">← Back to results</Link>

      <div className="details-card">
        <div className="vehicle-card__image details-image">
          <span>Image placeholder</span>
        </div>

        <h1>
          {vehicle.make} {vehicle.model}
        </h1>

        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Engine Size:</strong> {vehicle.engineSize}</p>
        <p><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
        <p><strong>Mileage:</strong> {vehicle.mileage.toLocaleString()}</p>
        <p><strong>Starting Bid:</strong> £{vehicle.startingBid.toLocaleString()}</p>
        <p><strong>Auction Date:</strong> {new Date(vehicle.auctionDateTime).toLocaleString()}</p>

        <h2>Specification</h2>
        <p><strong>Vehicle Type:</strong> {vehicle.details.specification.vehicleType}</p>
        <p><strong>Colour:</strong> {vehicle.details.specification.colour}</p>
        <p><strong>Fuel:</strong> {vehicle.details.specification.fuel}</p>
        <p><strong>Transmission:</strong> {vehicle.details.specification.transmission}</p>
        <p><strong>Number Of Doors:</strong> {vehicle.details.specification.numberOfDoors}</p>
        <p><strong>CO2 Emissions:</strong> {vehicle.details.specification.co2Emissions}</p>
        <p><strong>NOX Emissions:</strong> {vehicle.details.specification.noxEmissions}</p>
        <p><strong>Number Of Keys:</strong> {vehicle.details.specification.numberOfKeys}</p>

        <h2>Ownership</h2>
        <p><strong>Logbook:</strong> {vehicle.details.ownership.logbook}</p>
        <p><strong>Number Of Owners:</strong> {vehicle.details.ownership.numberOfOwners}</p>
        <p><strong>Date Of Registration:</strong> {vehicle.details.ownership.dateOfRegistration}</p>

        <h2>Equipment</h2>
        <ul>
          {vehicle.details.equipment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}