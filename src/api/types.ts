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
  SAVED = 'saved',
  MANUFACTURERS = 'manufacturers',
  CATEGORIES = 'categories',
  ORDERS = 'orders',
  ORDER = 'order',
  TRACK_ORDER = 'track-order',
  PAYMENTS = 'payments',
}
