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
}

export interface Profile {
  address: string;
  createdAt: any;
  dob: any;
  fullName: string;
  howDidYouHear: string;
  id: any;
  updatedAt: any;
  userId: number;
}
