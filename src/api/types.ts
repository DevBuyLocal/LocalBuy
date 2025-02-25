export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export enum QueryKey {
  USER = 'user',
  PRODUCTS = 'products',
  CART = 'cart',
  MANUFACTURERS = 'manufacturers',
  CATEGORIES = 'categories',
  ORDERS = 'orders',
  TRACK_ORDER = 'track-order',
  PAYMENTS = 'payments',
}
