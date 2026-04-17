export function getTimeUntilAuction(dateString: string) {
    const now = new Date().getTime();
    const target = new Date(dateString).getTime();
    const diff = Math.max(target - now, 0);
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    return { days, hours };
  }