import { Env } from '@env';
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  password: string;
  referralCode?: string;
};

export interface TLoginResponse {
  message: string;
  user: LoginResponse;
}

export interface LoginResponse {
  id: number;
  email: string;
  isVerified: boolean;
  type: string;
  token: string;
}

// Mock response for testing
const createMockLoginResponse = (
  email: string,
  referralCode?: string
): TLoginResponse => ({
  message: referralCode
    ? `Login successful! Referral code "${referralCode}" noted.`
    : 'Login successful',
  user: {
    id: Math.floor(Math.random() * 1000),
    email: email,
    isVerified: true,
    type: 'individual',
    token: 'mock_access_token_' + Date.now(),
  },
});

export const useLogin = createMutation<TLoginResponse, Variables, AxiosError>({
  mutationFn: async (variables) => {
    // Check if we're in test mode
    if (Env.TEST_MODE === 'true') {
      console.log('🧪 Login: Using test mode with mock response');
      console.log('🧪 Login: Email:', variables.email);
      console.log(
        '🧪 Login: Referral code:',
        variables.referralCode || 'None provided'
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return createMockLoginResponse(variables.email, variables.referralCode);
    }

    console.log('🌐 Login: Making real API call to:', Env.API_URL);
    return client.post('auth/login', variables).then((response) => {
      const { message, data } = response.data;
      const mapped: TLoginResponse = {
        message: message ?? 'Login successful',
        user: {
          ...data.user,
          token: data.token,
        },
      };
      return mapped;
    });
  },
});
