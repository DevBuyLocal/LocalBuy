import { useQuery } from '@tanstack/react-query';

import { accessToken } from '@/lib';
import { client } from '../common';

interface PaymentLinkOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    deliveryInfo: {
      address: string;
      phoneNumber: string;
    };
    expiresAt?: string;
  };
}

interface GetPaymentLinkOrderVariables {
  paymentLinkId: string;
}

export const useGetPaymentLinkOrder = (variables: GetPaymentLinkOrderVariables) => {
  return useQuery({
    queryKey: ['payment-link-order', variables.paymentLinkId],
    queryFn: async () => {
      const response = await client({
        url: `api/orders/payment-links/${variables.paymentLinkId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken()?.access}`,
        },
      });
      return response.data;
    },
    enabled: !!variables.paymentLinkId && !!accessToken()?.access,
  });
}; 