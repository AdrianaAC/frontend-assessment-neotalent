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
    <section className="toolbar">
      <select
        value={sortField}
        onChange={(e) => onFieldChange(e.target.value as SortField)}
      >
        <option value="make">Make</option>
        <option value="startingBid">Starting Bid</option>
        <option value="mileage">Mileage</option>
        <option value="auctionDateTime">Auction Date</option>
      </select>

      <select
        value={sortDirection}
        onChange={(e) => onDirectionChange(e.target.value as SortDirection)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </section>
  );
}