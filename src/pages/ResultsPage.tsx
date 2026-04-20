import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const allowedSortFields: SortField[] = [
  "make",
  "startingBid",
  "mileage",
  "auctionDateTime",
];
const allowedSortDirections: SortDirection[] = ["asc", "desc"];
const allowedPageSizes = [6, 12, 24];

function getSortField(value: string | null): SortField {
  return allowedSortFields.includes(value as SortField)
    ? (value as SortField)
    : "auctionDateTime";
}

function getSortDirection(value: string | null): SortDirection {
  return allowedSortDirections.includes(value as SortDirection)
    ? (value as SortDirection)
    : "asc";
}

function getPageSize(value: string | null) {
  const parsedValue = Number(value);
  return allowedPageSizes.includes(parsedValue) ? parsedValue : 12;
}

function getPage(value: string | null) {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

export default function ResultsPage() {
  const { vehicles, toggleFavourite } = useVehicles();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const filters = useMemo<Filters>(
    () => ({
      make: searchParams.get("make") ?? defaultFilters.make,
      model: searchParams.get("model") ?? defaultFilters.model,
      minBid: searchParams.get("minBid") ?? defaultFilters.minBid,
      maxBid: searchParams.get("maxBid") ?? defaultFilters.maxBid,
      favouritesOnly: searchParams.get("favouritesOnly") === "true",
    }),
    [searchParams]
  );
  const sortField = getSortField(searchParams.get("sort"));
  const sortDirection = getSortDirection(searchParams.get("direction"));
  const vehiclesPerPage = getPageSize(searchParams.get("pageSize"));
  const currentPage = getPage(searchParams.get("page"));

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

  function updateSearchParams(
    updates: Partial<Filters> & {
      sort?: SortField;
      direction?: SortDirection;
      page?: number;
      pageSize?: number;
    }
  ) {
    const nextParams = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === "" ||
        value === false ||
        (key === "page" && value === 1) ||
        (key === "pageSize" && value === 12) ||
        (key === "sort" && value === "auctionDateTime") ||
        (key === "direction" && value === "asc")
      ) {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, String(value));
    });

    navigate(
      {
        pathname: location.pathname,
        search: nextParams.toString() ? `?${nextParams.toString()}` : "",
      },
      { replace: true }
    );
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      updateSearchParams({ page: totalPages });
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
        onChange={(nextFilters) => updateSearchParams({ ...nextFilters, page: 1 })}
        onClear={() => navigate({ pathname: location.pathname, search: "" }, { replace: true })}
      />

      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onFieldChange={(value) => updateSearchParams({ sort: value, page: 1 })}
        onDirectionChange={(value) =>
          updateSearchParams({ direction: value, page: 1 })
        }
      />

      <section className="pagination-toolbar">
        <label className="pagination-toolbar__label">
          Vehicles per page
          <select
            value={vehiclesPerPage}
            onChange={(event) =>
              updateSearchParams({
                pageSize: Number(event.target.value),
                page: 1,
              })
            }
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
          onClick={() => updateSearchParams({ page: Math.max(currentPage - 1, 1) })}
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
            updateSearchParams({ page: Math.min(currentPage + 1, totalPages) })
          }
          disabled={currentPage === totalPages || visibleVehicles.length === 0}
        >
          Next
        </button>
      </nav>
    </main>
  );
}
