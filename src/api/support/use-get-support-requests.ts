import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TSupportRequestsResponse } from './types';

export const useGetSupportRequests = createQuery<
  TSupportRequestsResponse,
  void,
  AxiosError
>({
  queryKey: [QueryKey.SUPPORT_LIST],
  fetcher: () => {
    console.log('🔗 API: Starting support requests fetch...');
    console.log('🔑 API: Access token available:', !!accessToken()?.access);
    console.log('🌐 API: Request URL:', 'api/support');

    return client
      .get('api/support', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      })
      .then((response) => {
        console.log('✅ API: Support requests successful!');
        console.log('📊 API: Response status:', response.status);
        console.log('📄 API: Response data:', response.data);

        if (response.status === 200) {
          return response?.data;
        }
        return { 
          data: {
            requests: [],
            pagination: { 
              currentPage: 1, 
              hasNextPage: false, 
              hasPrevPage: false, 
              totalCount: 0, 
              totalPages: 0 
            }
          },
          message: 'No support requests found',
          success: true
        };
      })
      .catch((error: any) => {
        console.error('❌ API: Support requests failed');
        console.error('🔍 API: Error details:', error);
        console.error('📱 API: Error message:', error?.message);
        console.error('🌐 API: Response data:', error?.response?.data);
        console.error('📊 API: Response status:', error?.response?.status);
        throw error;
      });
  },
  enabled: true,
});
