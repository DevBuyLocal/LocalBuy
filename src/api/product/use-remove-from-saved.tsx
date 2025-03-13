import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = {
  productId: number;
};

export interface TRemoveFromSavedResponse {}

export const useRemoveFromSaved = createMutation<
  TRemoveFromSavedResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/product/save/${variables.productId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === QueryKey.SAVED;
          },
        });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.SAVED],
        });
        return response.data;
      }
    }),
});
