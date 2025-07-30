import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type ReferralResponse } from './types';

export const useGetReferral = createQuery<ReferralResponse, void, AxiosError>({
  queryKey: [QueryKey.USER, 'referral'],
  fetcher: () => {
    console.log('📍 GetReferral fetcher called');
    console.log('📍 GetReferral accessToken:', accessToken()?.access ? 'Present' : 'Missing');
    return client
      .get('api/user/referral', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        console.log('📍 GetReferral API response status:', response.status);
        console.log('📍 GetReferral API response data:', response?.data);
        return response?.data;
      })
      .catch((error: any) => {
        console.log('📍 GetReferral API error:', error);
        console.log('📍 GetReferral API error status:', error?.status);
        console.log('📍 GetReferral API error response:', error?.response);
        return error;
      });
  },
  enabled: !!accessToken()?.access,
  staleTime: 0, // Always refetch
}); 