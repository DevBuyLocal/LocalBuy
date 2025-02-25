import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
};

export interface TResetResponse {
  message: string;
}

export const useResetPassword = createMutation<
  TResetResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/reset',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
