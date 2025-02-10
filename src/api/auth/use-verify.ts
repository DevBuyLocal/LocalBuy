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
  mutationFn: async (variables) =>
    client({
      url: 'api/auth/verify',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
