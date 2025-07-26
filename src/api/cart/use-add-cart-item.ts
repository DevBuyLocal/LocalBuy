import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = {
  productOptionId: number;
  quantity: number;
};

export interface TAddCartResponse {}

export const useAddCartItem = createMutation<
  TAddCartResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) => {
    return client({
      url: 'api/cart',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.CART] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.CART],
        });
        return response.data;
      }
    });
  },
});
