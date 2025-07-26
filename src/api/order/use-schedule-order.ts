import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TOrder } from './types';

export interface TScheduleOrderResponse {
  order: TOrder;
}

type Variables = { scheduledDate: string | Date; orderId: number };

export const useScheduleOrder = createMutation<
  TScheduleOrderResponse,
  Variables,
  AxiosError
>({
  mutationFn: async ({ orderId, scheduledDate }) =>
    client({
      url: `api/orders/${orderId}/schedule`,
      method: 'POST',
      data: { scheduledDate },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('🚀 ~ response:', response.status);
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.ORDERS],
        });
        return response.data;
      }
    }),
});
