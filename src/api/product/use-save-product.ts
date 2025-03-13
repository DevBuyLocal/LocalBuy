import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = {
  productId: number;
};

export interface TAddCartResponse {}

export const useSaveProduct = createMutation<
  TAddCartResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) => {
    return client({
      url: 'api/product/save',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 201) {
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
    });
  },
});
