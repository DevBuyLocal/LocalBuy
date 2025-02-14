import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
};

export const useUpdatePassword = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/reset-password',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
