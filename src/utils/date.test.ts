import { describe, expect, it, vi } from "vitest";
import { getAuctionCountdownLabel } from "./date";

describe("getAuctionCountdownLabel", () => {
  it("returns a less-than-one-hour label before the auction starts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-20T11:30:00"));

    expect(getAuctionCountdownLabel("2026-04-20T12:00:00")).toBe(
      "Less than 1 hour"
    );

    vi.useRealTimers();
  });

  it("returns a live label once the auction has started", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-20T12:30:00"));

    expect(getAuctionCountdownLabel("2026-04-20T12:00:00")).toBe(
      "Auction is live"
    );

    vi.useRealTimers();
  });
});
