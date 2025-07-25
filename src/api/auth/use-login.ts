import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  password: string;
};

export interface TLoginResponse {
  message: string;
  success: boolean;
  data: {
    token: string;
    user: LoginResponse;
  };
}

export interface LoginResponse {
  id: number;
  email: string;
  isVerified: boolean;
  type: string;
  addresses: any[];
  defaultAddress: any;
  profile: any;
  role: any[];
}

export const useLogin = createMutation<TLoginResponse, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'api/auth/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
