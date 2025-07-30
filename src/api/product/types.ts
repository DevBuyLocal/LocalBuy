export interface TProduct {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  manufacturerId: number;
  createdAt: string;
  updatedAt: string;
  options: Option[];
  manufacturer: Manufacturer;
  category: TSingleCategory;
}

export interface Option {
  id: number;
  value: string;
  price: number;
  moq: number;
  bulkPrice?: number;     // Bulk discounted price
  bulkMoq?: number;       // Bulk MOQ threshold
  image: string[];
  productId: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  country: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSingleCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TDeal {
  id: number;
  name: string;
  image: string;
  description: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: TDealProduct[];
  categories: TSingleCategory[];
}

export interface TDealProduct {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  manufacturerId: number;
  createdAt: string;
  updatedAt: string;
}
