import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
};

export interface TResendCodeResponse {
  message: string;
  response: ResendCodeResponse;
}

export interface ResendCodeResponse {
  id: number;
  email: string;
  isVerified: boolean;
  type: string;
  code: string;
  token: string;
}

export const useResendCode = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/resend',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
