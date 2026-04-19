import type { Filters } from "../types/vehicle";

type Props = {
  filters: Filters;
  makes: string[];
  onChange: (filters: Filters) => void;
  onClear: () => void;
};

export default function FilterBar({
  filters,
  makes,
  onChange,
  onClear,
}: Props) {
  return (
    <section className="toolbar">
      <select
        aria-label="Make filter"
        value={filters.make}
        onChange={(e) => onChange({ ...filters, make: e.target.value })}
      >
        <option value="">All makes</option>
        {makes.map((make) => (
          <option key={make} value={make}>
            {make}
          </option>
        ))}
      </select>

      <input
        type="text"
        aria-label="Model filter"
        placeholder="Filter by model"
        value={filters.model}
        onChange={(e) => onChange({ ...filters, model: e.target.value })}
      />

      <input
        type="number"
        aria-label="Minimum bid"
        placeholder="Min bid"
        value={filters.minBid}
        onChange={(e) => onChange({ ...filters, minBid: e.target.value })}
      />

      <input
        type="number"
        aria-label="Maximum bid"
        placeholder="Max bid"
        value={filters.maxBid}
        onChange={(e) => onChange({ ...filters, maxBid: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={filters.favouritesOnly}
          onChange={(e) =>
            onChange({ ...filters, favouritesOnly: e.target.checked })
          }
        />
        Favourites only
      </label>

      <button type="button" onClick={onClear}>
        Clear filters
      </button>
    </section>
  );
}
