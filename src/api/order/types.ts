export type TOrderResponse = TOrder[];

export interface TOrder {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate: any;
  paymentStatus: string;
  orderType: string;
  amountDue: number;
  amountPaid: number;
  shippingPaymentType: string;
  isArchived: boolean;
  archivedAt: any;
  archivedBy: any;
  archiveReason: any;
  items: Item[];
  shipping: Shipping;
  timeline: Timeline[];
  shippingAddress: ShippingAddress2;
  transactions: Transaction[];
}

export interface Item {
  id: number;
  productId: number;
  productOptionId: any;
  orderId: number;
  quantity: number;
  price: number;
  selectedOption: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  businessProductId: any;
  businessProductOptionId: any;
  originalProductOptionId: number;
  paymentStatus: string;
  product: Product;
  unitPrice: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  processingTimeDays: number;
  acceptsReturns: boolean;
  manufacturerId: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  type: string;
  isActive: boolean;
  businessOwnerId: any;
  platformProductId: any;
  stockAlert: boolean;
  criticalLevel: number;
  targetLevel: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  includeSaturdays: boolean;
}

export interface Transaction {
  id: number;
  orderId: number;
  amount: number;
  reference: string;
  status: string;
  gateway: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  scheduledDate: null;
  createdAt: Date;
  updatedAt: Date;
  items: Item[];
}

export interface Shipping {
  id: number;
  orderId: number;
  distance: number;
  totalWeight: number;
  distanceFee: number;
  weightFee: number;
  totalShippingFee: number;
  createdAt: string;
  updatedAt: string;
  paymentType: string;
}

export interface Timeline {
  id: number;
  orderId: number;
  action: string;
  status: string;
  details: Details;
  createdAt: string;
}

export interface Details {
  addressSaved: boolean;
  totalSavings: number;
  addressSource: string;
  shippingAddress: ShippingAddress;
  newAddressProvided: boolean;
  bulkDiscountApplied: boolean;
  shippingPaymentType: string;
  itemsWithBulkDiscount: number;
}

export interface ShippingAddress {
  id: number;
  city: string;
  source: string;
  country: string;
  postalCode: string;
  addressType: string;
  fullAddress: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  stateProvince: string;
}

export interface ShippingAddress2 {
  id: number;
  city: string;
  source: string;
  country: string;
  postalCode: string;
  addressType: string;
  fullAddress: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  stateProvince: string;
}
