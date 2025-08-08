import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  code: string;
  email: string;
};

export interface TVerifyResponse {
  message: string;
  response: VerifyResponse;
}

export interface VerifyResponse {
  id: number;
  email: string;
  isVerified: boolean;
  type: string;
  code: string;
  token: string;
}

export const useVerify = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) => {
    console.log('📍 Verification API call with data:', variables);
    return client({
      url: 'api/auth/verify',
      method: 'POST',
      data: variables,
    })
      .then((response) => {
        console.log('📍 Verification API success:', response.data);
        return response.data;
      })
      .catch((error) => {
        console.log('📍 Verification API error:', error);
        console.log('📍 Verification API error response:', error?.response?.data);
        console.log('📍 Verification API error status:', error?.response?.status);
        throw error;
      });
  },
});
