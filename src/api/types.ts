export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export enum QueryKey {
  USER = 'user',
  PRODUCTS = 'products',
  SAVED_PRODUCTS = 'saved-products',
  CART = 'cart',
  SAVED = 'saved',
  MANUFACTURERS = 'manufacturers',
  CATEGORIES = 'categories',
  ORDERS = 'orders',
  ORDER = 'order',
  TRACK_ORDER = 'track-order',
  PAYMENTS = 'payments',
  NOTIFICATIONS = 'notifications',
  DEALS = 'deals',
  // Support request queries
  SUPPORT_LIST = 'support-list',
  SUPPORT_DETAIL = 'support-detail',
  FEEDBACK = 'feedback',
}
