import { useQuery } from '@tanstack/react-query';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

export interface PaymentStatusResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
    paymentReference?: string;
    amount?: number;
    paidAt?: string;
  };
}

type Variables = {
  orderId: string | number;
};

export const useCheckPaymentStatus = createMutation<
  PaymentStatusResponse,
  Variables,
  any
>({
  mutationFn: async (variables: Variables) => {
    // For now, use the get single order endpoint to check payment status
    // This endpoint should contain the latest payment status information
    const response = await client({
      url: `api/orders/${variables.orderId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    });
    
    if (response.status === 200) {
      // Invalidate orders query to refresh order data
      await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
      
      // Transform the order data to match our PaymentStatusResponse interface
      const orderData = response.data;
      const transformedResponse: PaymentStatusResponse = {
        success: true,
        message: 'Payment status retrieved successfully',
        data: {
          orderId: variables.orderId.toString(),
          paymentStatus: orderData.order?.paymentStatus || 'PENDING',
          paymentReference: orderData.order?.paymentReference,
          amount: orderData.order?.totalPrice || orderData.order?.amountDue,
          paidAt: orderData.order?.paidAt || orderData.order?.updatedAt,
        },
      };
      
      return transformedResponse;
    }
    throw new Error('Failed to check payment status');
  },
});

// Hook for polling payment status
export const usePollPaymentStatus = (orderId: string | number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['payment-status', orderId],
    queryFn: async () => {
      // Use the get single order endpoint to check payment status
      const response = await client({
        url: `api/orders/${orderId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      });
      
      if (response.status === 200) {
        // Invalidate orders query to refresh order data
        await queryClient.invalidateQueries({ queryKey: [QueryKey.ORDERS] });
        
        // Transform the order data to match our PaymentStatusResponse interface
        const orderData = response.data;
        const transformedResponse: PaymentStatusResponse = {
          success: true,
          message: 'Payment status retrieved successfully',
          data: {
            orderId: orderId.toString(),
            paymentStatus: orderData.order?.paymentStatus || 'PENDING',
            paymentReference: orderData.order?.paymentReference,
            amount: orderData.order?.totalPrice || orderData.order?.amountDue,
            paidAt: orderData.order?.paidAt || orderData.order?.updatedAt,
          },
        };
        
        return transformedResponse;
      }
      throw new Error('Failed to check payment status');
    },
    enabled,
    refetchInterval: (data) => {
      // Stop polling if payment is completed (PAID, FAILED, CANCELLED)
      const paymentStatus = data?.data?.paymentStatus;
      if (paymentStatus === 'PAID' || paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
        console.log(`🛑 Stopping payment polling for order ${orderId} - Status: ${paymentStatus}`);
        return false;
      }
      // Poll every 10 seconds if still pending
      return 10000;
    },
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: 5000,
  });
};
