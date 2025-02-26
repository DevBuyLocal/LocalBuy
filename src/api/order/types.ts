export type TOrderResponse = TOrder[];

export interface TOrder {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  scheduledDate: null;
  createdAt: string;
  updatedAt: string;
  items: Item[];
  transactions: Transaction[];
}

export interface Item {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  price: number;
  selectedOption: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  manufacturerId: number;
  createdAt: string;
  updatedAt: string;
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
