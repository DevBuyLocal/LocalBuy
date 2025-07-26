import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { type TPutUser } from '../auth';
import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TUser } from './types';

type Variables = Partial<TUser & TPutUser>;
type Response = TUser;

export const useUpdateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: 'api/auth/update-profile',
      method: 'PUT',
      data: variables,
      headers: {
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0] === QueryKey.USER;
            },
          });
          await queryClient.refetchQueries({
            queryKey: [QueryKey.USER],
          });
        }

        return response.data;
      })
      .catch((err) => {
        console.log('🚀 ~ file: use-update-user.ts:16 ~ err:', err);
        throw err;
      });
  },
});
