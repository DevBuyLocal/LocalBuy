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
        // Invalidate and refetch cart data immediately
        await queryClient.invalidateQueries({ queryKey: [QueryKey.CART] });
        await queryClient.refetchQueries({ queryKey: [QueryKey.CART] });
        return response.data;
      }
    });
  },
});
