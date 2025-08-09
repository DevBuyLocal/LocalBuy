import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';

import { useGetPaymentLinkOrder } from '@/api/order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { colors, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryInfo {
  address: string;
  phoneNumber: string;
}

interface OrderData {
  orderId: string;
  amount: number;
  items: OrderItem[];
  deliveryInfo: DeliveryInfo;
  expiresAt?: string;
}

export default function PaymentLinkPage() {
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [checkoutUri, setCheckoutUri] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { paymentLinkId } = useLocalSearchParams<{ paymentLinkId: string }>();
  const { replace } = useRouter();
  const { setError, loading, setLoading, setSuccess } = useLoader({
    showLoadingPage: false,
  });

  const { data: orderData, isLoading: orderLoading, error } = useGetPaymentLinkOrder({
    paymentLinkId: paymentLinkId || '',
  });

  const handleMakePayment = () => {
    if (!orderData?.data) {
      Alert.alert('Error', 'Order details not available');
      return;
    }

    // For now, we'll show a placeholder. In a real implementation,
    // this would redirect to Paystack with the order details
    Alert.alert(
      'Payment',
      'This would redirect to Paystack payment gateway. Implementation pending.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' },
      ]
    );
  };

  const handlePaymentSuccess = () => {
    setSuccess('Payment successful!');
    setShowPaymentModal(false);
    // Redirect to success page or back to main app
    setTimeout(() => {
      replace('/');
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
    setError(error?.response?.data || 'Payment failed');
    setShowPaymentModal(false);
  };

  if (orderLoading) {
    return (
      <Container.Page>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primaryText} />
          <Text className="mt-4 text-gray-600">Loading order details...</Text>
        </View>
      </Container.Page>
    );
  }

  if (error || !orderData?.data) {
    return (
      <Container.Page>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-[20px] font-bold text-gray-800">
            Order Not Found
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            The payment link you're looking for doesn't exist or has expired.
          </Text>
          <CustomButton
            label="Go Home"
            onPress={() => replace('/')}
            className="w-full max-w-sm"
          />
        </View>
      </Container.Page>
    );
  }

  // Safely extract data with proper type checking
  const orderDataSafe = orderData.data as OrderData;
  const { orderId, amount, items, deliveryInfo, expiresAt } = orderDataSafe;
  
  // Check if data is valid
  if (!orderId || !amount || !items || !deliveryInfo) {
    return (
      <Container.Page>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-[20px] font-bold text-gray-800">
            Invalid Order Data
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            The order data is incomplete or corrupted.
          </Text>
          <CustomButton
            label="Go Home"
            onPress={() => replace('/')}
            className="w-full max-w-sm"
          />
        </View>
      </Container.Page>
    );
  }

  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  if (isExpired) {
    return (
      <Container.Page>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-[20px] font-bold text-gray-800">
            Payment Link Expired
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            This payment link has expired. Please contact the order owner for a new link.
          </Text>
          <CustomButton
            label="Go Home"
            onPress={() => replace('/')}
            className="w-full max-w-sm"
          />
        </View>
      </Container.Page>
    );
  }

  return (
    <Container.Page>
      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-6">
          <Text className="mb-2 text-center text-[24px] font-bold text-gray-800">
            Payment Request
          </Text>
          <Text className="text-center text-gray-600">
            Someone has requested payment for this order
          </Text>
        </View>

        {/* Order Summary */}
        <View className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-[18px] font-bold text-gray-800">
            Order Summary
          </Text>
          <View className="mb-4">
            <Text className="text-gray-600">Order ID: {orderId}</Text>
            <Text className="text-[20px] font-bold text-gray-800">
              Total Amount: NGN {amount.toLocaleString()}
            </Text>
          </View>

          {/* Items */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-700">Items:</Text>
            {Array.isArray(items) && items.map((item, index) => (
              <View key={index} className="mb-2 flex-row justify-between">
                <Text className="text-gray-600">
                  {item.name || 'Unknown Item'} x{item.quantity || 1}
                </Text>
                <Text className="text-gray-600">NGN {(item.price || 0).toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Delivery Info */}
          <View>
            <Text className="mb-2 font-semibold text-gray-700">Delivery Details:</Text>
            <Text className="text-gray-600">{deliveryInfo.address || 'Address not available'}</Text>
            <Text className="text-gray-600">{deliveryInfo.phoneNumber || 'Phone not available'}</Text>
          </View>
        </View>

        {/* Expiry Info */}
        {expiresAt && (
          <View className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <Text className="text-center text-orange-700">
              ⏰ This payment link expires on{' '}
              {new Date(expiresAt).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Make Payment Button */}
        <CustomButton
          label="Make Payment"
          onPress={handleMakePayment}
          loading={loading}
          className="w-full"
        />
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <SafeAreaView className="flex-1 p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[20px] font-bold text-gray-800">
              Complete Payment
            </Text>
            <Pressable onPress={() => setShowPaymentModal(false)}>
              <Text className="text-lg text-gray-600">✕</Text>
            </Pressable>
          </View>

          {checkoutUri ? (
            <WebView
              source={{ uri: checkoutUri }}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onMessage={(e) => {
                try {
                  // Handle payment success/failure messages
                  const data = JSON.parse(e.nativeEvent.data);
                  if (data.status === 'success') {
                    handlePaymentSuccess();
                  } else if (data.status === 'failed') {
                    handlePaymentError(data);
                  }
                } catch (parseError) {
                  console.error('Error parsing WebView message:', parseError);
                }
              }}
              style={{ flex: 1 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-600">Loading payment gateway...</Text>
            </View>
          )}

          {isLoading && (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color={colors.primaryText} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </Container.Page>
  );
} 