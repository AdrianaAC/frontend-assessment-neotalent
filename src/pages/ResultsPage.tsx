import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const HeaderMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: ${({ theme }) => theme.colors.chipText};
  font-size: 0.92rem;
  font-weight: 600;
`;

const ActiveFilters = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 12px 0 22px;
`;

const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceSoft};
  color: ${({ theme }) => theme.colors.chipText};
  cursor: pointer;
  font-weight: 600;

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  }
`;

const StatusNote = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

const PageSection = styled.section`
  margin-top: 28px;
`;

const SectionHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const SectionHeading = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
`;

const SectionNote = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

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

function buildActiveFilters(filters: Filters) {
  return [
    filters.make
      ? { key: "make", label: `Make: ${filters.make}` }
      : null,
    filters.model
      ? { key: "model", label: `Model: ${filters.model}` }
      : null,
    filters.minBid
      ? { key: "minBid", label: `Min bid: ${filters.minBid}` }
      : null,
    filters.maxBid
      ? { key: "maxBid", label: `Max bid: ${filters.maxBid}` }
      : null,
    filters.favouritesOnly
      ? { key: "favouritesOnly", label: "Favourites only" }
      : null,
  ].filter((value): value is { key: keyof Filters; label: string } => value !== null);
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
  const activeFilters = useMemo(() => buildActiveFilters(filters), [filters]);
  const favouriteCount = useMemo(
    () => vehicles.filter((vehicle) => vehicle.favourite).length,
    [vehicles]
  );

  const updateSearchParams = useCallback(
    (
    updates: Partial<Filters> & {
      sort?: SortField;
      direction?: SortDirection;
      page?: number;
      pageSize?: number;
    }
    ) => {
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
    },
    [location.pathname, location.search, navigate]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      updateSearchParams({ page: totalPages });
    }
  }, [currentPage, totalPages, updateSearchParams]);

  return (
    <main id="main-content" className="page">
      <header className="page-header">
        <h1>Vehicle Results</h1>
        <HeaderMeta>
          <p aria-live="polite" aria-atomic="true">
            Showing {visibleVehicles.length} of {totalVehicles} vehicles
          </p>
          <HeaderBadge>
            {favouriteCount} favourites saved on this device
          </HeaderBadge>
        </HeaderMeta>
        <StatusNote>
          Filters, sorting, and page state stay in the URL, and favourites persist locally.
        </StatusNote>
      </header>

      <PageSection aria-labelledby="filters-heading">
        <SectionHeader>
          <SectionHeading id="filters-heading">Filters</SectionHeading>
          <SectionNote>Narrow the catalogue by make, model, bid, or favourites.</SectionNote>
        </SectionHeader>

        <FilterBar
          filters={filters}
          makes={makes}
          onChange={(nextFilters) => updateSearchParams({ ...nextFilters, page: 1 })}
          onClear={() => navigate({ pathname: location.pathname, search: "" }, { replace: true })}
        />

        {activeFilters.length > 0 ? (
          <ActiveFilters aria-label="Active filters">
            {activeFilters.map((filter) => (
              <FilterChip
                key={filter.key}
                type="button"
                aria-label={`Clear ${filter.label} filter`}
                onClick={() =>
                  updateSearchParams({
                    [filter.key]:
                      filter.key === "favouritesOnly" ? false : "",
                    page: 1,
                  } as Partial<Filters> & { page: number })
                }
              >
                {filter.label}
                <span aria-hidden="true">x</span>
              </FilterChip>
            ))}
          </ActiveFilters>
        ) : null}
      </PageSection>

      <PageSection aria-labelledby="sort-heading">
        <SectionHeader>
          <SectionHeading id="sort-heading">Sort Results</SectionHeading>
          <SectionNote>Choose how vehicles are ordered before you browse.</SectionNote>
        </SectionHeader>

        <SortControls
          sortField={sortField}
          sortDirection={sortDirection}
          onFieldChange={(value) => updateSearchParams({ sort: value, page: 1 })}
          onDirectionChange={(value) =>
            updateSearchParams({ direction: value, page: 1 })
          }
        />
      </PageSection>

      <PageSection aria-labelledby="results-heading">
        <SectionHeader>
          <SectionHeading id="results-heading">Available Vehicles</SectionHeading>
          <SectionNote>Browse the current page of matching vehicles.</SectionNote>
        </SectionHeader>

        <div className="pagination-toolbar">
          <div className="pagination-toolbar__field">
            <label className="pagination-toolbar__label" htmlFor="page-size">
              Vehicles per page
            </label>
            <select
              id="page-size"
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
          </div>

          <p className="pagination-toolbar__summary">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <section className="vehicle-grid" aria-label="Vehicle listing">
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

        <footer>
          <nav className="pagination" aria-label="Pagination">
            <button
              type="button"
              aria-label="Go to previous page"
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
              aria-label="Go to next page"
              onClick={() =>
                updateSearchParams({ page: Math.min(currentPage + 1, totalPages) })
              }
              disabled={currentPage === totalPages || visibleVehicles.length === 0}
            >
              Next
            </button>
          </nav>
        </footer>
      </PageSection>
    </main>
  );
}
