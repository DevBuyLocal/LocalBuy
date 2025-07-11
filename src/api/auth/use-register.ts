import { Env } from '@env';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  password: string;
  type: string;
  referal_code?: string;
};

type Response = {
  message: string;
  response: {
    id: number;
    email: string;
    isVerified: boolean;
    type: string;
  };
};

// Mock response for testing
const createMockRegisterResponse = (email: string): Response => ({
  message:
    'Registration successful! Please check your email for verification code.',
  response: {
    id: Math.floor(Math.random() * 1000),
    email: email,
    isVerified: false,
    type: 'individual',
  },
});

export const useRegister = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    // Check if we're in test mode
    if (Env.TEST_MODE === 'true') {
      console.log('🧪 Register: Using test mode with mock response');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockRegisterResponse(variables.email);
    }

    console.log('🌐 Register: Making real API call to:', Env.API_URL);
    return client({
      url: 'auth/register',
      method: 'POST',
      data: variables,
    }).then((response) => response.data);
  },
});
