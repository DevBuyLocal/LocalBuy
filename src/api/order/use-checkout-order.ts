import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TOrder } from './types';

export interface TCheckoutOrderResponse {
  order: TOrder;
}

export const useCheckoutOrder = createMutation<
  TCheckoutOrderResponse,
  void,
  AxiosError
>({
  mutationFn: async () =>
    client({
      url: 'api/orders',
      method: 'POST',
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 201) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        // Completely disable cart invalidation during order creation
        // Cart will only be cleared after successful payment verification
        // await queryClient.invalidateQueries({ queryKey: [QueryKey.CART] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.ORDERS],
        });
        // await queryClient.fetchQuery({
        //   queryKey: [QueryKey.CART],
        // });
        return response.data;
      }
    }),
});
