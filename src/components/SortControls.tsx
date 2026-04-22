import type { SortDirection, SortField } from "../types/vehicle";

type Props = {
  sortField: SortField;
  sortDirection: SortDirection;
  onFieldChange: (value: SortField) => void;
  onDirectionChange: (value: SortDirection) => void;
};

export default function SortControls({
  sortField,
  sortDirection,
  onFieldChange,
  onDirectionChange,
}: Props) {
  return (
    <div className="toolbar">
      <div className="toolbar-field">
        <label htmlFor="sort-field">Sort by</label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => onFieldChange(e.target.value as SortField)}
        >
          <option value="make">Make</option>
          <option value="startingBid">Starting Bid</option>
          <option value="mileage">Mileage</option>
          <option value="auctionDateTime">Auction Date</option>
        </select>
      </div>

      <div className="toolbar-field">
        <label htmlFor="sort-direction">Direction</label>
        <select
          id="sort-direction"
          value={sortDirection}
          onChange={(e) => onDirectionChange(e.target.value as SortDirection)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
