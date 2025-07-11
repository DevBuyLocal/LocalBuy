import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
};

export interface TResendCodeResponse {
  message: string;
  success: boolean;
}

// Mock response for testing - removed unused function

export const useResendCode = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    return client
      .post('auth/resend-code', variables)
      .then((response) => response.data);
  },
});
