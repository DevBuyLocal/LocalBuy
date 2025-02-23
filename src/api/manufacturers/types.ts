export interface TManufacturer {
  message: string;
  data: TSingleManufacturers[];
}

export interface TSingleManufacturers {
  id: number;
  name: string;
  country: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}
