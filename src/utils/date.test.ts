import { describe, expect, it, vi } from "vitest";
import { getAuctionCountdownLabel } from "./date";
import { formatDateTime } from "./format";
import { parseAuctionDate } from "./auctionDate";

describe("getAuctionCountdownLabel", () => {
  it("returns a less-than-one-hour label before the auction starts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(parseAuctionDate("2026-04-20T11:30:00"));

    expect(getAuctionCountdownLabel("2026-04-20T12:00:00")).toBe(
      "Less than 1 hour",
    );

    vi.useRealTimers();
  });

  it("returns a live label once the auction has started", () => {
    vi.useFakeTimers();
    vi.setSystemTime(parseAuctionDate("2026-04-20T12:30:00"));

    expect(getAuctionCountdownLabel("2026-04-20T12:00:00")).toBe(
      "Auction is live",
    );

    vi.useRealTimers();
  });

  it("parses auction times in the auction timezone instead of browser local time", () => {
    expect(parseAuctionDate("2026-04-20T12:00:00").toISOString()).toBe(
      "2026-04-20T11:00:00.000Z",
    );
    expect(parseAuctionDate("2026-12-20T12:00:00").toISOString()).toBe(
      "2026-12-20T12:00:00.000Z",
    );
  });

  it("formats auction timestamps consistently in the auction timezone", () => {
    expect(formatDateTime("2026-04-20T12:00:00")).toContain("12:00");
    expect(formatDateTime("2026-04-20T12:00:00")).toMatch(/BST|GMT\+1/);
  });
});
