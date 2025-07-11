import { Env } from '@env';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  code: string;
};

type Response = {
  message: string;
  user?: {
    id: number;
    email: string;
    isVerified: boolean;
    type: string;
  };
};

// Mock response for testing
const createMockVerifyResponse = (email: string): Response => ({
  message: 'Email verified successfully!',
  user: {
    id: Math.floor(Math.random() * 1000),
    email: email,
    isVerified: true,
    type: 'individual',
  },
});

export const useVerify = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    // Check if we're in test mode
    if (Env.TEST_MODE === 'true') {
      console.log('🧪 Verify: Using test mode with mock response');
      // Accept any 6-digit code in test mode
      if (variables.code.length === 6) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return createMockVerifyResponse(variables.email);
      } else {
        throw new Error('Please enter a 6-digit verification code');
      }
    }

    console.log('🌐 Verify: Making real API call to:', Env.API_URL);
    return client
      .post('auth/verify', variables)
      .then((response) => response.data);
  },
});
