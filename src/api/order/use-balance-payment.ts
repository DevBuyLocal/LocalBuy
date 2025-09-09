import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

export interface BalancePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentReference: string;
    paymentUrl: string;
    orderId: number;
    balanceAmount: number;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
    transactionId: string;
    linkedPaymentReference?: string; // Reference to the first payment
  };
}

type Variables = {
  orderId: string | number;
  balanceAmount: number;
  firstPaymentReference: string; // Reference from the initial delivery fee payment
  paymentMethod?: 'CARD' | 'BANK_TRANSFER';
};

export const useBalancePayment = createMutation<
  BalancePaymentResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables: Variables) => {
    const url = `api/payment/orders/${variables.orderId}/balance`;
    const payload = {
      balanceAmount: variables.balanceAmount,
      firstPaymentReference: variables.firstPaymentReference,
      paymentMethod: variables.paymentMethod || 'CARD',
    };
    
    console.log('💰 BALANCE PAYMENT - Making API call to:', url);
    console.log('💰 BALANCE PAYMENT - Payload:', JSON.stringify(payload, null, 2));
    
    return client({
      url: url,
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('💰 BALANCE PAYMENT - Response status:', response.status);
      console.log('💰 BALANCE PAYMENT - Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.status === 200 || response.status === 201) {
        // Invalidate orders to refresh order data
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        return response.data;
      }
      
      throw new Error('Failed to initialize balance payment');
    }).catch(error => {
      console.log('❌ BALANCE PAYMENT - Error:', error.response?.data);
      throw error;
    });
  },
});

export interface VerifyBalancePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentReference: string;
    orderId: number;
    balanceAmount: number;
    status: 'PAID' | 'FAILED' | 'CANCELLED';
    paidAt?: string;
    linkedPaymentReference: string;
    totalAmountPaid: number; // Total amount paid for the order (delivery + balance)
  };
}

type VerifyVariables = {
  reference: string;
  orderId: string | number;
};

export const useVerifyBalancePayment = createMutation<
  VerifyBalancePaymentResponse,
  VerifyVariables,
  AxiosError
>({
  mutationFn: async (variables: VerifyVariables) => {
    const url = `api/payment/orders/${variables.orderId}/balance/verify`;
    const payload = {
      reference: variables.reference,
    };
    
    console.log('✅ VERIFY BALANCE - Making API call to:', url);
    console.log('✅ VERIFY BALANCE - Payload:', JSON.stringify(payload, null, 2));
    
    return client({
      url: url,
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('✅ VERIFY BALANCE - Response status:', response.status);
      console.log('✅ VERIFY BALANCE - Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.status === 200) {
        // Invalidate orders and cart to refresh data
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER] });
        return response.data;
      }
      
      throw new Error('Failed to verify balance payment');
    }).catch(error => {
      console.log('❌ VERIFY BALANCE - Error:', error.response?.data);
      throw error;
    });
  },
});
