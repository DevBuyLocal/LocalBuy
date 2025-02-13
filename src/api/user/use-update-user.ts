import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type User } from './types';

type Variables = User;
type Response = User;

export const useUpdateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'api/auth/update-profile',
      method: 'PUT',
      data: variables,
      headers: {
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => response.data),
  onSuccess: async () => {
    //Refetch user data
    await queryClient.refetchQueries({
      queryKey: [QueryKey.USER],
    });
  },
});
