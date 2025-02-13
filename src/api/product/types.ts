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
  category: Category;
}

export interface Option {
  id: number;
  value: string;
  price: number;
  moq: number;
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

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
