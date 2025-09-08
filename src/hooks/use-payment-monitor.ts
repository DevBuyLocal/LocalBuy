import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useGetAllOrders } from '@/api/order';
import { useCheckPaymentStatus } from '@/api/order/use-check-payment-status';
import { usePaymentNotifications } from './use-payment-notifications';

/**
 * Hook to monitor payment status for all pending orders
 * This runs in the background and checks for payment updates
 */
export const usePaymentMonitor = () => {
  const { data: ordersData } = useGetAllOrders();
  const { mutate: checkPaymentStatus } = useCheckPaymentStatus();
  const { showPaymentNotification } = usePaymentNotifications();

  // Get all orders with pending payment status
  const pendingOrders = ordersData?.orders?.orders?.filter((order: any) => 
    order.paymentStatus === 'PENDING' || 
    order.paymentStatus === 'PROCESSING' ||
    order.paymentStatus === 'INITIATED'
  ) || [];

  useEffect(() => {
    if (pendingOrders.length === 0) return;

    // Check payment status for all pending orders
    const checkAllPendingPayments = () => {
      console.log(`🔍 Checking payment status for ${pendingOrders.length} pending orders`);
      
      pendingOrders.forEach((order: any) => {
        checkPaymentStatus(
          { orderId: order.id },
          {
            onSuccess: (data) => {
              console.log(`✅ Payment status updated for order ${order.id}:`, data.data.paymentStatus);
              
              // Show notification if payment status changed
              if (data.data.paymentStatus !== 'PENDING') {
                showPaymentNotification({
                  orderId: order.id,
                  paymentStatus: data.data.paymentStatus,
                  orderNumber: order.orderNumber,
                  amount: data.data.amount,
                });
              }
            },
            onError: (error) => {
              console.log(`❌ Failed to check payment status for order ${order.id}:`, error);
            },
          }
        );
      });
    };

    // Check immediately
    checkAllPendingPayments();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkAllPendingPayments, 30000);

    // Check when app comes to foreground
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('📱 App came to foreground, checking payment status');
        checkAllPendingPayments();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(interval);
      subscription?.remove();
    };
  }, [pendingOrders, checkPaymentStatus]);
};
