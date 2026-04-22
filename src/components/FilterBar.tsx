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
    <div className="toolbar">
      <div className="toolbar-field">
        <label htmlFor="make-filter">Make</label>
        <select
          id="make-filter"
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
      </div>

      <div className="toolbar-field">
        <label htmlFor="model-filter">Model</label>
        <input
          id="model-filter"
          type="text"
          placeholder="Filter by model"
          value={filters.model}
          onChange={(e) => onChange({ ...filters, model: e.target.value })}
        />
      </div>

      <div className="toolbar-field">
        <label htmlFor="min-bid-filter">Min bid</label>
        <input
          id="min-bid-filter"
          type="number"
          placeholder="Min bid"
          value={filters.minBid}
          onChange={(e) => onChange({ ...filters, minBid: e.target.value })}
        />
      </div>

      <div className="toolbar-field">
        <label htmlFor="max-bid-filter">Max bid</label>
        <input
          id="max-bid-filter"
          type="number"
          placeholder="Max bid"
          value={filters.maxBid}
          onChange={(e) => onChange({ ...filters, maxBid: e.target.value })}
        />
      </div>

      <label className="toolbar-checkbox">
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
    </div>
  );
}
