const AUCTION_TIME_ZONE = "Europe/London";

type AuctionDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function parseAuctionDateParts(value: string): AuctionDateParts {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);

  if (!match) {
    throw new Error(`Invalid auction date: ${value}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? "0"),
  };
}

function getTimeZoneOffsetMinutes(timestamp: number, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset",
  });

  const timeZoneName = formatter
    .formatToParts(new Date(timestamp))
    .find((part) => part.type === "timeZoneName")?.value;

  const match = /GMT([+-]\d{1,2})(?::(\d{2}))?/.exec(timeZoneName ?? "");

  if (!match) {
    return 0;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const sign = hours >= 0 ? 1 : -1;

  return hours * 60 + sign * minutes;
}

export function parseAuctionDate(value: string) {
  const { year, month, day, hour, minute, second } =
    parseAuctionDateParts(value);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  let offsetMinutes = getTimeZoneOffsetMinutes(utcGuess, AUCTION_TIME_ZONE);
  let timestamp = utcGuess - offsetMinutes * 60 * 1000;

  const adjustedOffsetMinutes = getTimeZoneOffsetMinutes(
    timestamp,
    AUCTION_TIME_ZONE
  );

  if (adjustedOffsetMinutes !== offsetMinutes) {
    offsetMinutes = adjustedOffsetMinutes;
    timestamp = utcGuess - offsetMinutes * 60 * 1000;
  }

  return new Date(timestamp);
}

export function getAuctionTimeZone() {
  return AUCTION_TIME_ZONE;
}
