import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type AddressData = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  addressType: string;
};

type Variables = AddressData;
type Response = {
  message: string;
  data: AddressData;
};

export const useAddAddress = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const token = accessToken()?.access;
    console.log('📍 AddAddress API - Token available:', !!token);
    console.log('📍 AddAddress API - Token value:', token);
    console.log('📍 AddAddress API - Request data:', variables);
    
    return client({
      url: 'api/auth/add-address',
      method: 'POST',
      data: variables,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0] === QueryKey.USER;
            },
          });
          await queryClient.refetchQueries({
            queryKey: [QueryKey.USER],
          });
        }

        return response.data;
      })
      .catch((err) => {
        console.log('🚀 ~ AddAddress API error:', err);
        console.log('🚀 ~ AddAddress API error response:', err?.response?.data);
        console.log('🚀 ~ AddAddress API error status:', err?.response?.status);
        throw err;
      });
  },
}); 