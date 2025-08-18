import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TSupportRequest, type TSupportRequestResponse } from './types';

type NormalizedResponse = { request: TSupportRequest };

export const useGetSpecificSupportRequest = (id: string | number) => {
  return createQuery<NormalizedResponse, void, AxiosError>({
    queryKey: [QueryKey.SUPPORT_DETAIL, id],
    fetcher: () => {
      console.log('🔗 API: Starting specific support request fetch...');
      console.log('📤 API: Request ID:', id);
      console.log('🔑 API: Access token available:', !!accessToken()?.access);
      console.log('🌐 API: Request URL:', `api/support/${id}`);

      return client
        .get(`api/support/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken()?.access}`,
          },
        })
        .then((response) => {
          console.log('✅ API: Specific support request successful!');
          console.log('📊 API: Response status:', response.status);
          console.log('📄 API: Raw Response data:', response.data);

          if (response.status === 200) {
            // Normalize: backend may return { data: {...} } or direct object
            const payload = response?.data;
            const request = payload?.data || payload?.request || payload;
            return { request } as NormalizedResponse;
          }
          throw new Error('Support request not found');
        })
        .catch((error: any) => {
          console.error('❌ API: Specific support request failed');
          console.error('🔍 API: Error details:', error);
          console.error('📱 API: Error message:', error?.message);
          console.error('🌐 API: Response data:', error?.response?.data);
          console.error('📊 API: Response status:', error?.response?.status);
          console.error('🔧 API: Request config:', error?.config);
          throw error;
        });
    },
    enabled: true,
  });
};
