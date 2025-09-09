import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

export interface UpdateOrderPaymentRequest {
  orderId: number;
  shippingPaymentType: 'PAY_NOW' | 'PAY_ON_DELIVERY';
}

export interface UpdateOrderPaymentResponse {
  success: boolean;
  message: string;
  order: {
    id: number;
    shippingPaymentType: string;
    amountDue: number;
    totalPrice: number;
  };
}

export const useUpdateOrderPayment = createMutation<
  UpdateOrderPaymentResponse,
  UpdateOrderPaymentRequest,
  AxiosError
>({
  mutationFn: async (data) => {
    const response = await client({
      url: `api/orders/${data.orderId}/payment-type`,
      method: 'PATCH',
      data: { shippingPaymentType: data.shippingPaymentType },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    });

    if (response.status === 200) {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER] });
      return response.data;
    }
    
    throw new Error('Failed to update order payment');
  },
});