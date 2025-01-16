export const shortenAddress = (address: any, length?: number) =>
  address ? address?.slice(0, length || 2) + '...' + address?.slice(-10) : '';
