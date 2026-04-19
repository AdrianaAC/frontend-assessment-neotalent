import { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import SortControls from "../components/SortControls";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../context/VehicleContext";
import type { Filters, SortDirection, SortField } from "../types/vehicle";
import { filterVehicles } from "../utils/filters";
import { sortVehicles } from "../utils/sort";

const defaultFilters: Filters = {
  make: "",
  model: "",
  minBid: "",
  maxBid: "",
  favouritesOnly: false,
};

export default function ResultsPage() {
  const { vehicles, toggleFavourite } = useVehicles();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortField, setSortField] = useState<SortField>("auctionDateTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [vehiclesPerPage, setVehiclesPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const totalVehicles = useMemo(() => vehicles.length, [vehicles]);
  const makes = useMemo(
    () => [...new Set(vehicles.map((vehicle) => vehicle.make))].sort(),
    [vehicles]
  );
  const visibleVehicles = useMemo(() => {
    const filteredVehicles = filterVehicles(vehicles, filters);
    return sortVehicles(filteredVehicles, sortField, sortDirection);
  }, [filters, sortDirection, sortField, vehicles]);
  const totalPages = Math.max(
    1,
    Math.ceil(visibleVehicles.length / vehiclesPerPage)
  );
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * vehiclesPerPage;
    return visibleVehicles.slice(startIndex, startIndex + vehiclesPerPage);
  }, [currentPage, vehiclesPerPage, visibleVehicles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortDirection, sortField, vehiclesPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Vehicle Results</h1>
        <p>
          Showing {visibleVehicles.length} of {totalVehicles} vehicles
        </p>
      </header>

      <FilterBar
        filters={filters}
        makes={makes}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
      />

      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onFieldChange={setSortField}
        onDirectionChange={setSortDirection}
      />

      <section className="pagination-toolbar">
        <label className="pagination-toolbar__label">
          Vehicles per page
          <select
            value={vehiclesPerPage}
            onChange={(event) => setVehiclesPerPage(Number(event.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </label>

        <p className="pagination-toolbar__summary">
          Page {currentPage} of {totalPages}
        </p>
      </section>

      <section className="vehicle-grid">
        {visibleVehicles.length === 0 ? (
          <p className="empty-state">No vehicles match the current filters.</p>
        ) : null}

        {paginatedVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onToggleFavourite={toggleFavourite}
          />
        ))}
      </section>

      <nav className="pagination" aria-label="Vehicle results pages">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="pagination__status">
          {visibleVehicles.length === 0
            ? "No pages available"
            : `Viewing page ${currentPage} of ${totalPages}`}
        </span>

        <button
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          disabled={currentPage === totalPages || visibleVehicles.length === 0}
        >
          Next
        </button>
      </nav>
    </main>
  );
}
