import { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';
import { accessToken } from '@/lib';
import { client } from '../common';

export interface InitializeOrderPaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    reference: string;
    accessCode: string;
    paymentMethod: string;
    amount: number;
    formattedAmount: string;
    currency: string;
  };
}

type Variables = {
  orderId: number;
  paymentMethod?: string;
  isPartialPayment?: boolean;
  amount?: number;
  paymentType?: 'FULL' | 'SPLIT' | 'DELIVERY_FEE_ONLY';
};

export const useInitializeOrderPayment = createMutation<
  InitializeOrderPaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables: Variables) => {
    const url = `api/payment/orders/${variables.orderId}/pay`;
    const payload: any = { 
      paymentMethod: variables.paymentMethod || 'CARD' 
    };
    
    // Add split payment information if provided
    if (variables.isPartialPayment !== undefined) {
      payload.isPartialPayment = variables.isPartialPayment;
    }
    
    if (variables.amount !== undefined) {
      payload.amount = variables.amount;
    }
    
    if (variables.paymentType !== undefined) {
      payload.paymentType = variables.paymentType;
    }
    
    console.log('🎯 HOOK - Making API call to:', url);
    console.log('🎯 HOOK - Payload:', JSON.stringify(payload, null, 2));
    
    return client({
      url: url,
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('🎯 HOOK - Response status:', response.status);
      console.log('🎯 HOOK - Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.status === 200) {
        return response.data;
      }
    }).catch(error => {
      console.log('❌ HOOK - Error:', error.response?.data);
      throw error;
    });
  },
});

