import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

interface PaymentNotificationProps {
  orderId: string | number;
  paymentStatus: 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING';
  orderNumber?: string;
  amount?: number;
}

/**
 * Hook to show payment status notifications
 */
export const usePaymentNotifications = () => {
  const previousStatuses = useRef<Map<string, string>>(new Map());

  const showPaymentNotification = ({
    orderId,
    paymentStatus,
    orderNumber,
    amount,
  }: PaymentNotificationProps) => {
    const orderKey = orderId.toString();
    const previousStatus = previousStatuses.current.get(orderKey);
    
    // Only show notification if status changed
    if (previousStatus === paymentStatus) return;
    
    previousStatuses.current.set(orderKey, paymentStatus);

    switch (paymentStatus) {
      case 'PAID':
        Alert.alert(
          '🎉 Payment Successful!',
          `Your payment for Order #${orderNumber || orderId} has been completed successfully.${amount ? ` Amount: ₦${amount.toLocaleString()}` : ''}`,
          [
            {
              text: 'View Order',
              onPress: () => {
                // Navigate to order details or success page
                console.log('Navigate to order details');
              },
            },
            { text: 'OK', style: 'default' },
          ]
        );
        break;
        
      case 'FAILED':
        Alert.alert(
          '❌ Payment Failed',
          `Your payment for Order #${orderNumber || orderId} has failed. Please try again or contact support.`,
          [
            { text: 'Try Again', style: 'default' },
            { text: 'Contact Support', style: 'default' },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
        
      case 'CANCELLED':
        Alert.alert(
          '🚫 Payment Cancelled',
          `Your payment for Order #${orderNumber || orderId} has been cancelled. You can try again anytime.`,
          [
            { text: 'Try Again', style: 'default' },
            { text: 'OK', style: 'cancel' },
          ]
        );
        break;
        
      default:
        break;
    }
  };

  return { showPaymentNotification };
};
