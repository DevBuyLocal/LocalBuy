import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = {
  cartItemId: number;
};

export interface TRemoveCartItemResponse {}

export const useRemoveCartItem = createMutation<
  TRemoveCartItemResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/cart`,
      method: 'DELETE',
      data: { cartItemId: variables.cartItemId },
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
    }),
});
