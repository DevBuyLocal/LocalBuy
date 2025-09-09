import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';
import { type TOrder } from './types';

export interface CheckoutOrderRequest {
  shippingPaymentType?: 'PAY_NOW' | 'PAY_ON_DELIVERY';
  orderType?: 'IMMEDIATE' | 'SCHEDULED';
  scheduledDate?: string;
  distance?: number;
  addressId?: number;
  newAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode?: string;
    phoneNumber?: string;
  };
  saveAddress?: boolean;
}

export interface TCheckoutOrderResponse {
  order: TOrder;
  paymentRequired: boolean;
  nextSteps: {
    message: string;
    paymentAmount: number;
  };
}

export const useCheckoutOrder = createMutation<
  TCheckoutOrderResponse,
  CheckoutOrderRequest,
  AxiosError
>({
  mutationFn: async (data) => // ✅ Accept data parameter
    client({
      url: 'api/orders',
      method: 'POST',
      data: data, // ✅ Pass the actual data
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 201) {
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