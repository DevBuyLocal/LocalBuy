import { useMutation } from '@tanstack/react-query';

import { accessToken } from '@/lib';
import { client } from '../common';

interface GeneratePaymentLinkResponse {
  success: boolean;
  message: string;
  data: {
    paymentLinkId: string;
    paymentLink: string;
    orderId: string;
    amount: number;
    expiresAt?: string;
  };
}

interface GeneratePaymentLinkVariables {
  orderId: string;
  amount?: number;
  paymentType?: 'DELIVERY_FEE' | 'FULL';
}

export const useGeneratePaymentLink = () => {
  return useMutation({
    mutationFn: async (variables: GeneratePaymentLinkVariables) => {
      const response = await client({
        url: `api/orders/${variables.orderId}/payment-links`,
        method: 'POST',
        data: {
          ...(variables.amount != null ? { amount: variables.amount } : {}),
          ...(variables.paymentType ? { paymentType: variables.paymentType } : {}),
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken()?.access}`,
        },
      });
      
      return response.data as GeneratePaymentLinkResponse;
    },
  });
}; 