import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TSubmitFeedback, type TSubmitFeedbackResponse } from './types';

// Map frontend feedback types to backend expected format
const mapFeedbackTypeToAPI = (type: TSubmitFeedback['type']): string => {
  const typeMap = {
    'Rating': 'RATINGS',
    'Comment': 'COMMENTS', 
    'Suggestion': 'SUGGESTIONS',
    'Complaint': 'COMPLAINTS'
  } as const;
  
  return typeMap[type];
};

export const useSubmitFeedback = createMutation<
  TSubmitFeedbackResponse,
  TSubmitFeedback,
  AxiosError
>({
  mutationFn: async (variables) => {
    console.log('🔗 API: Starting feedback submission...');
    console.log('📤 API: Request data (original):', variables);
    
    // Map the feedback type to backend format
    const mappedType = mapFeedbackTypeToAPI(variables.type);
    const apiPayload = {
      ...variables,
      type: mappedType
    };
    
    console.log('🔄 API: Mapped feedback type:', {
      original: variables.type,
      mapped: mappedType
    });
    console.log('📤 API: Request data (mapped):', apiPayload);
    console.log('🔑 API: Access token available:', !!accessToken()?.access);
    console.log('🌐 API: Request URL:', 'api/feedback');
    
    return client({
      url: 'api/feedback',
      method: 'POST',
      data: apiPayload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('✅ API: Feedback request successful!');
      console.log('📊 API: Response status:', response.status);
      console.log('📄 API: Response data:', response.data);
      
      if (response.status === 201 || response.status === 200) {
        console.log('🔄 API: Invalidating feedback queries...');
        // Invalidate feedback requests to refresh the list
        await queryClient.invalidateQueries({ queryKey: [QueryKey.FEEDBACK] });
        console.log('✅ API: Queries invalidated, returning response data');
        return response.data;
      }
      
      console.error('❌ API: Unexpected response status:', response.status);
      throw new Error('Failed to submit feedback');
    }).catch((error) => {
      console.error('❌ API: Feedback request failed');
      console.error('🔍 API: Error details:', error);
      console.error('📱 API: Error message:', error?.message);
      console.error('🌐 API: Response data:', error?.response?.data);
      console.error('📊 API: Response status:', error?.response?.status);
      console.error('🔧 API: Request config:', error?.config);
      throw error;
    });
  },
});
