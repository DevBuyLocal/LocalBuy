import { Env } from '@env';
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken, setUser, signOut } from '@/lib';
import { UserType } from '@/lib/constants';

import { client } from '../common/client';
import { QueryKey } from '../types';
import type { TUser } from './types';

type Response = TUser;

// Mock user data for testing - this will be updated when profile is modified
let mockUserData: TUser | null = null;

const createMockUser = (): TUser => {
  // Return existing mock data if available, otherwise create new
  if (mockUserData) {
    return mockUserData;
  }

  // Create a user similar to the real backend response with null profile
  const newMockUser: TUser = {
    id: 1,
    email: 'test@example.com',
    isVerified: true,
    type: UserType.Individual, // Use enum instead of string
    businessProfile: null,
    phoneNumber: null,
    profile: null, // Start with null profile like real backend
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockUserData = newMockUser;
  return newMockUser;
};

// Function to update mock user data
export const updateMockUserData = (
  updates: Partial<TUser> & {
    address?: string;
    deliveryPhone?: string;
    fullName?: string;
    businessName?: string;
    businessAddress?: string;
    businessPhone?: string;
    cacNumber?: string;
    howDidYouFindUs?: string;
    cac?: string;
  }
): TUser => {
  console.log('🚀 ~ updateMockUserData ~ Called with updates:', updates);
  console.log(
    '🚀 ~ updateMockUserData ~ Current mockUserData before update:',
    mockUserData
  );

  // Ensure we have mock user data to work with
  if (!mockUserData) {
    mockUserData = createMockUser();
  }

  // Create profile if it doesn't exist and we're updating profile-related fields
  const needsProfile =
    updates.address ||
    updates.deliveryPhone ||
    updates.fullName ||
    updates.businessName ||
    updates.businessAddress ||
    updates.businessPhone ||
    updates.cacNumber ||
    updates.cac ||
    updates.howDidYouFindUs ||
    updates.profile;

  if (!mockUserData.profile && needsProfile) {
    mockUserData.profile = {
      id: 1,
      fullName: null,
      deliveryPhone: null,
      businessName: null,
      businessAddress: null,
      cacNumber: null,
      howDidYouHear: null,
      address: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dob: null,
      userId: mockUserData.id,
      businessPhone: null,
    };
  }

  mockUserData = {
    ...mockUserData,
    ...updates,
    profile: mockUserData.profile
      ? {
          ...mockUserData.profile,
          ...(updates.profile || {}),
          // Handle direct field updates (from individual forms)
          address:
            updates.address ||
            updates.profile?.address ||
            mockUserData.profile?.address,
          deliveryPhone:
            updates.deliveryPhone ||
            updates.profile?.deliveryPhone ||
            mockUserData.profile?.deliveryPhone,
          fullName:
            updates.fullName ||
            updates.profile?.fullName ||
            mockUserData.profile?.fullName,
          businessName:
            updates.businessName ||
            updates.profile?.businessName ||
            mockUserData.profile?.businessName,
          businessAddress:
            updates.businessAddress ||
            updates.profile?.businessAddress ||
            mockUserData.profile?.businessAddress,
          businessPhone:
            updates.businessPhone ||
            updates.profile?.businessPhone ||
            mockUserData.profile?.businessPhone,
          cacNumber:
            updates.cacNumber ||
            updates.cac ||
            updates.profile?.cacNumber ||
            mockUserData.profile?.cacNumber,
          howDidYouHear:
            updates.howDidYouFindUs ||
            updates.profile?.howDidYouHear ||
            mockUserData.profile?.howDidYouHear,
        }
      : null,
  };

  console.log('🚀 ~ updateMockUserData ~ Updated mockUserData:', mockUserData);
  console.log(
    '🚀 ~ updateMockUserData ~ Updated address:',
    mockUserData.profile?.address
  );

  return mockUserData;
};

export const useGetUser = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.USER],
  fetcher: async () => {
    console.log('🚀 ~ useGetUser ~ Fetcher called - getting user data');

    // Check if we're in test mode
    if (Env.TEST_MODE === 'true') {
      console.log('🧪 GetUser: Using test mode with mock data');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get or create mock user data
      const userData = createMockUser();
      console.log('🧪 GetUser: Returning mock user data:', userData);
      console.log('🧪 GetUser: Mock user address:', userData.profile?.address);

      setUser(userData);
      return userData;
    }

    console.log('🌐 GetUser: Making real API call to:', Env.API_URL);
    // Real API call
    return client
      .get('auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response?.data?.data);
        }
        return response?.data?.data;
      })
      .catch((error: any) => {
        // SIGN USER OUT IF UNAUTHORIZED
        const status = error?.response?.status;
        if (status >= 400 && status < 500) {
          signOut();
        }
        throw error;
      });
  },
  enabled: !!accessToken()?.access,
});
