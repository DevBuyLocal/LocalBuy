import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TSubmitSupportRequest, type TSubmitSupportResponse } from './types';

export const useSubmitSupportRequest = createMutation<
  TSubmitSupportResponse,
  TSubmitSupportRequest,
  AxiosError
>({
  mutationFn: async (variables) => {
    console.log('🔗 API: Starting support request submission...');
    console.log('📤 API: Request data:', variables);
    console.log('🔑 API: Access token available:', !!accessToken()?.access);
    console.log('🌐 API: Request URL:', 'api/support');
    
    return client({
      url: 'api/support',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('✅ API: Request successful!');
      console.log('📊 API: Response status:', response.status);
      console.log('📄 API: Response data:', response.data);
      
      if (response.status === 201 || response.status === 200) {
        console.log('🔄 API: Invalidating support queries...');
        // Invalidate support requests to refresh the list
        await queryClient.invalidateQueries({ queryKey: [QueryKey.SUPPORT] });
        console.log('✅ API: Queries invalidated, returning response data');
        return response.data;
      }
      
      console.error('❌ API: Unexpected response status:', response.status);
      throw new Error('Failed to submit support request');
    }).catch((error) => {
      console.error('❌ API: Request failed');
      console.error('🔍 API: Error details:', error);
      console.error('📱 API: Error message:', error?.message);
      console.error('🌐 API: Response data:', error?.response?.data);
      console.error('📊 API: Response status:', error?.response?.status);
      console.error('🔧 API: Request config:', error?.config);
      throw error;
    });
  },
});
