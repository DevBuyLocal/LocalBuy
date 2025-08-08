import { type UserType } from '@/lib/constants';

export interface TUser {
  address: Address[];
  addresses: Address2[];
  complianceScore: number;
  complianceStatus: string;
  createdAt: string;
  defaultAddress: DefaultAddress;
  email: string;
  hasFreeShipping: boolean;
  hasAddress: boolean;
  id: number;
  isVerified: boolean;
  lastComplianceCheck: any;
  phoneNumber: any;
  profile: Profile;
  referralCode: string;
  referredBy: any;
  requiresAddress: boolean;
  roles: Role[];
  status: string;
  type: UserType;
  updatedAt: string;
}
export interface Address {
  addressLine1: string;
  addressLine2: any;
  addressType: string;
  city: string;
  country: string;
  createdAt: string;
  id: number;
  isActive: boolean;
  isDefault: boolean;
  phoneNumber: any;
  postalCode: string;
  stateProvince: string;
  updatedAt: string;
  userId: number;
}

export interface Address2 {
  addressLine1: string;
  addressLine2: any;
  addressType: string;
  city: string;
  country: string;
  createdAt: string;
  id: number;
  isActive: boolean;
  isDefault: boolean;
  phoneNumber: any;
  postalCode: string;
  stateProvince: string;
  updatedAt: string;
  userId: number;
}

export interface DefaultAddress {
  addressLine1: string;
  addressLine2: any;
  addressType: string;
  city: string;
  country: string;
  createdAt: string;
  id: number;
  isActive: boolean;
  isDefault: boolean;
  phoneNumber: any;
  postalCode: string;
  stateProvince: string;
  updatedAt: string;
  userId: number;
}

export interface Profile {
  address: any;
  createdAt: string;
  deliveryPhone: string;
  dob: any;
  fullName: string;
  howDidYouHear: string;
  id: number;
  updatedAt: string;
  userId: number;
}

export interface Role {
  createdAt: string;
  id: number;
  role: string[];
  roleId: number;
  updatedAt: string;
  userId: number;
}

// Referral types
export interface ReferralData {
  referralCode: string;
  referralCount?: number;
  totalEarnings?: number;
  pendingEarnings?: number;
}

export interface ReferralResponse {
  data: ReferralData;
  message: string;
  status: string;
}
