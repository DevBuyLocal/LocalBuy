import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

export interface VerifyPaymentResponse {
  id: number;
  paymentReference: string;
  amount: number;
  status: string;
  createdAt: string;
}

type Variables = {
  reference: string;
};

export const useVerifyPayment = createMutation<
  VerifyPaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: 'api/payment/verify',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        await queryClient.invalidateQueries({ queryKey: [QueryKey.CART] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.ORDERS],
        });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.CART],
        });
        return response.data;
      }
    }),
});
