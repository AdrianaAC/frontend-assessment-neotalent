export function getTimeUntilAuction(dateString: string) {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const rawDiff = target - now;
  const diff = Math.max(rawDiff, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    days,
    hours,
    hasStarted: rawDiff <= 0,
    isLessThanOneHour: rawDiff > 0 && rawDiff < 1000 * 60 * 60,
  };
}

export function getAuctionCountdownLabel(dateString: string) {
  const { days, hours, hasStarted, isLessThanOneHour } =
    getTimeUntilAuction(dateString);

  if (hasStarted) {
    return "Auction is live";
  }

  if (isLessThanOneHour) {
    return "Less than 1 hour";
  }

  return `${days}d ${hours}h`;
}
