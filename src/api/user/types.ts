import { type UserType } from '@/lib/constants';

export interface TUser {
  businessProfile: any;
  createdAt: string;
  email: string;
  id: number;
  isVerified: boolean;
  phoneNumber: any;
  profile: Profile | null;
  type: UserType;
  updatedAt: string;
}

export interface Profile {
  address: string | null;
  createdAt: any;
  dob: any;
  fullName: string | null;
  howDidYouHear: string | null;
  id: any;
  updatedAt: any;
  userId: number;
  businessName: string | null;
  businessAddress: string | null;
  cacNumber: string | null;
  deliveryPhone: string | null;
  businessPhone: string | null;
}
