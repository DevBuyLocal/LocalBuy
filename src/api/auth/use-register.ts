import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  email: string;
  type: 'individual' | 'business';
  phone: string;
  password: string;
};
type Response = {
  data: any;
};

export const useRegister = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/register',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
