import { Env } from '@env';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken, setUser } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import type { TUser } from './types';
import { updateMockUserData } from './use-get-user';

type Variables = Partial<TUser> & {
  address?: string; // Add address as a direct property for location updates
  deliveryPhone?: string; // Add deliveryPhone for profile updates
  fullName?: string; // Add fullName for profile updates
  businessName?: string; // Add businessName for business profile updates
  businessAddress?: string; // Add businessAddress for business profile updates
  businessPhone?: string; // Add businessPhone for business profile updates
  cacNumber?: string; // Add cacNumber for business profile updates
  howDidYouFindUs?: string; // Add howDidYouFindUs for profile updates
  cac?: string; // Add cac (alias for cacNumber) for business profile updates
};
type Response = TUser;

export const useUpdateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    // Check if we're in test mode
    if (Env.TEST_MODE === 'true') {
      console.log('🧪 UpdateUser: Using test mode with mock response');
      console.log('🧪 UpdateUser: Variables received:', variables);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the mock user data with new information
      const updatedUser = updateMockUserData(variables);

      console.log('🧪 UpdateUser: Mock user updated:', updatedUser);
      console.log(
        '🧪 UpdateUser: New address in profile:',
        updatedUser.profile?.address
      );

      // Update the auth store with the new data
      setUser(updatedUser);

      return updatedUser;
    }

    console.log('🌐 UpdateUser: Making real API call to:', Env.API_URL);
    // Real API call
    return client
      .patch('api/auth/me', variables, {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response?.data?.data);
        }
        return response?.data?.data;
      });
  },
  onSuccess: async (data, _variables) => {
    console.log('🚀 ~ useUpdateUser ~ Success:', data);
    console.log(
      '🚀 ~ useUpdateUser ~ Updated address in response:',
      data.profile?.address
    );

    // Invalidate and refetch the user query to update the UI
    console.log('🚀 ~ useUpdateUser ~ Invalidating user query...');
    await queryClient.invalidateQueries({
      queryKey: [QueryKey.USER],
    });

    console.log('🚀 ~ useUpdateUser ~ Refetching user query...');
    await queryClient.refetchQueries({
      queryKey: [QueryKey.USER],
    });

    console.log('🚀 ~ useUpdateUser ~ Cache invalidation complete');
  },
  onError: (error, _variables) => {
    console.error('🚀 ~ useUpdateUser ~ Error:', error);
  },
});
