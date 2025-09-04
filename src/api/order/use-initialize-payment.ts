import { AxiosError } from 'axios';
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
  paymentMethod?: string;
  paymentType?: 'DELIVERY_FEE' | 'FULL';
};

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
  order: {
    id: number;
    orderNumber: string;
    status: string;
    paymentType: string;
  };
}


export const useInitializePayment = createMutation<
  InitializePaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables: Variables) => {
    const url = `api/payment/orders/${variables.orderId}/pay`;
    console.log('🎯 Making API call to:', url);
    console.log('🎯 With payload:', { paymentMethod: 'CARD' });
    
    return client({
      url: url,
      method: 'POST',
      data: { paymentMethod: 'CARD' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('🎯 API response status:', response.status);
      console.log('🎯 API response data:', response.data);
      if (response.status === 200) {
        return response.data;
      }
    }).catch(error => {
      console.log('❌ API call failed:', error.response?.data);
      throw error;
    });
  },
});


export const useInitializeOrderPayment = createMutation<
  InitializeOrderPaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables: Variables) =>
    client({
      url: `api/payment/orders/${variables.orderId}/pay`,
      method: 'POST',
      data: { paymentMethod: variables.paymentMethod || 'CARD' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        return response.data;
      }
    }),
});