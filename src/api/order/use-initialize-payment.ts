import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';

export interface InitializePaymentResponse {
  id: number;
  paymentReference: string;
  amount: number;
  status: string;
  createdAt: string;
}

type Variables = {
  orderId: number;
  email: string;
  amount: number;
};

export const useInitializePayment = createMutation<
  InitializePaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: 'api/payment/initialize',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('🚀 ~ response:', response?.data);
      if (response.status === 200) {
        return response.data;
      }
    }),
});
