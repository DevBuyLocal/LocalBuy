import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

export interface TCheckoutOrderResponse {
  id: number;
  status: string;
  total: number;
  createdAt: string;
}

export const useCheckoutOrder = createMutation<any, void, AxiosError>({
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
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.ORDERS],
        });
        return response.data;
      }
    }),
});
