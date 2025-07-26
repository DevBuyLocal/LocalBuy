import { type UserType } from '@/lib/constants';

export interface TUser {
  businessProfile: any;
  createdAt: string;
  email: string;
  id: number;
  isVerified: boolean;
  phoneNumber: any;
  profile: Profile;
  type: UserType;
  updatedAt: string;
  defaultAddress?: {
    addressLine1: string;
    addressLine2: string | null;
    addressType: string;
    city: string;
    country: string;
    createdAt: string;
    id: number;
    isActive: boolean;
    isDefault: boolean;
    phoneNumber: string | null;
    postalCode: string;
    stateProvince: string;
    updatedAt: string;
    userId: number;
  };
}

export interface Profile {
  address: string;
  addressLine2?: string;
  createdAt: any;
  dob: any;
  fullName: string;
  howDidYouHear: string;
  id: any;
  updatedAt: any;
  userId: number;
  businessName: null;
  businessAddress: null;
  cacNumber: null;
  deliveryPhone: string | null;
  businessPhone: string | null;
}
