import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';

type Variables = { preference: string[] };
type Response = any;

export const useSavePreference = createMutation<
  Response,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const token = accessToken()?.access;
    return client({
      url: 'api/auth/preference',
      method: 'POST',
      data: variables,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.data);
  },
});
