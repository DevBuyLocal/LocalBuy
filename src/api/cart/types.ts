export interface TCartItemResPonse {
  data: {
    id: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    items: TCartItem[];
    summary: {
      bulkItemsCount: number;
      formatted: any;
      internal: any;
      itemCount: number;
      itemsWithBulkDiscount: number;
      overallSavingsPercentage: number;
      totalPrice: number;
      totalRetailPrice: number;
      totalSavings: number;
    };
  };
  message: string;
  success: boolean;
}

export interface TCartItem {
  id: number;
  cartId: number;
  productOptionId: number;
  quantity: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  productOption: TProductOption;
}

export interface TProductOption {
  id: number;
  value: string;
  price: number;
  moq: number;
  image: string[];
  productId: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  manufacturerId: number;
  createdAt: Date;
  updatedAt: Date;
}
