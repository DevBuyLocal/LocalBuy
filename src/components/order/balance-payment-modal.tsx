import React from 'react';
import { ActivityIndicator, Alert, Modal, Pressable } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useBalancePayment, useVerifyBalancePayment } from '@/api/order';
import CustomButton from '@/components/general/custom-button';
import { colors, Text, View } from '@/components/ui';

interface BalancePaymentModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string | number;
  balanceAmount: number;
  firstPaymentReference: string;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: string) => void;
}

export const BalancePaymentModal: React.FC<BalancePaymentModalProps> = ({
  visible,
  onClose,
  orderId,
  balanceAmount,
  firstPaymentReference,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [showWebView, setShowWebView] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = React.useState<string>('');
  const [paymentReference, setPaymentReference] = React.useState<string>('');
  const [retryCount, setRetryCount] = React.useState(0);

  const { mutate: initializeBalancePayment, isPending: isInitializing } = useBalancePayment();
  const { mutate: verifyBalancePayment, isPending: isVerifying } = useVerifyBalancePayment();

  const webViewRef = React.useRef<WebView>(null);

  // Initialize balance payment
  const handleInitializePayment = React.useCallback(() => {
    console.log('🚀 Initializing balance payment for order:', orderId);
    
    initializeBalancePayment(
      {
        orderId,
        balanceAmount,
        firstPaymentReference,
        paymentMethod: 'CARD',
      },
      {
        onSuccess: (response) => {
          console.log('✅ Balance payment initialized:', response);
          setPaymentUrl(response.data.paymentUrl);
          setPaymentReference(response.data.paymentReference);
          setShowWebView(true);
        },
        onError: (error: any) => {
          console.log('❌ Balance payment initialization failed:', error);
          const errorMessage = error?.response?.data?.message || 'Failed to initialize balance payment';
          
          Alert.alert(
            'Payment Error',
            errorMessage,
            [
              { text: 'Cancel', onPress: onClose },
              { text: 'Retry', onPress: handleRetryPayment },
            ]
          );
          
          onPaymentError?.(errorMessage);
        },
      }
    );
  }, [orderId, balanceAmount, firstPaymentReference, initializeBalancePayment, onClose, onPaymentError]);

  const handleRetryPayment = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
    setShowWebView(false);
    setPaymentUrl('');
    setPaymentReference('');
    
    // Add a small delay before retrying
    setTimeout(() => {
      handleInitializePayment();
    }, 1000);
  }, [handleInitializePayment]);

  const handleWebViewNavigation = React.useCallback(
    (event: WebViewNavigation) => {
      const { url } = event;
      console.log('🌐 WebView navigation:', url);

      // Check for success URL patterns
      if (url.includes('success') || url.includes('completed')) {
        console.log('✅ Payment appears successful, verifying...');
        
        verifyBalancePayment(
          {
            reference: paymentReference,
            orderId,
          },
          {
            onSuccess: (verificationResponse) => {
              console.log('✅ Balance payment verified:', verificationResponse);
              
              setShowWebView(false);
              
              Alert.alert(
                'Payment Successful!',
                `Your balance payment of ₦${balanceAmount.toLocaleString()} has been completed successfully.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      onPaymentSuccess?.(verificationResponse);
                      onClose();
                    },
                  },
                ]
              );
            },
            onError: (error: any) => {
              console.log('❌ Balance payment verification failed:', error);
              setShowWebView(false);
              
              Alert.alert(
                'Verification Failed',
                'Payment verification failed. Please contact support if money was deducted.',
                [
                  { text: 'Cancel', onPress: onClose },
                  { text: 'Retry Verification', onPress: () => handleWebViewNavigation(event) },
                ]
              );
            },
          }
        );
      }
      
      // Check for failure URL patterns
      else if (url.includes('failed') || url.includes('error') || url.includes('cancelled')) {
        console.log('❌ Payment failed or cancelled');
        setShowWebView(false);
        
        Alert.alert(
          'Payment Failed',
          'Your balance payment was not completed. You can try again anytime.',
          [
            { text: 'Cancel', onPress: onClose },
            { text: 'Try Again', onPress: handleRetryPayment },
          ]
        );
      }
    },
    [paymentReference, orderId, balanceAmount, verifyBalancePayment, onPaymentSuccess, onClose, handleRetryPayment]
  );

  // Auto-initialize payment when modal opens
  React.useEffect(() => {
    if (visible && !paymentUrl && !isInitializing) {
      handleInitializePayment();
    }
  }, [visible, paymentUrl, isInitializing, handleInitializePayment]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!visible) {
      setShowWebView(false);
      setPaymentUrl('');
      setPaymentReference('');
      setRetryCount(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
          <View>
            <Text className="text-lg font-semibold">Complete Balance Payment</Text>
            <Text className="text-sm text-gray-600">
              Order #{orderId} • ₦{balanceAmount.toLocaleString()}
            </Text>
          </View>
          <Pressable onPress={onClose} className="p-2">
            <Text className="text-lg font-medium text-gray-600">✕</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1">
          {!showWebView ? (
            // Loading or Error State
            <View className="flex-1 items-center justify-center p-6">
              {isInitializing ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text className="mt-4 text-center text-gray-600">
                    Initializing your balance payment...
                  </Text>
                  <Text className="mt-2 text-center text-sm text-gray-500">
                    Amount: ₦{balanceAmount.toLocaleString()}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-semibold mb-4">Complete Your Balance Payment</Text>
                  <Text className="text-center text-gray-600 mb-6">
                    Pay the remaining ₦{balanceAmount.toLocaleString()} to complete your order.
                  </Text>
                  
                  {retryCount > 0 && (
                    <View className="mb-4 p-3 bg-orange-50 rounded-lg">
                      <Text className="text-sm text-orange-700 text-center">
                        Retry attempt #{retryCount}
                      </Text>
                    </View>
                  )}
                  
                  <CustomButton
                    label="Start Payment"
                    onPress={handleInitializePayment}
                    disabled={isInitializing}
                    className="w-full"
                  />
                  
                  <CustomButton
                    label="Cancel"
                    onPress={onClose}
                    variant="outline"
                    className="w-full mt-3 border-gray-300"
                    textClassName="text-gray-700"
                  />
                </>
              )}
            </View>
          ) : (
            // WebView for Payment
            <View className="flex-1">
              {isVerifying && (
                <View className="absolute top-0 left-0 right-0 z-10 bg-blue-50 p-3">
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text className="ml-2 text-blue-700">Verifying payment...</Text>
                  </View>
                </View>
              )}
              
              <WebView
                ref={webViewRef}
                source={{ uri: paymentUrl }}
                onNavigationStateChange={handleWebViewNavigation}
                startInLoadingState
                renderLoading={() => (
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text className="mt-2 text-gray-600">Loading payment page...</Text>
                  </View>
                )}
                onError={(error) => {
                  console.log('❌ WebView error:', error);
                  Alert.alert(
                    'Connection Error',
                    'Failed to load payment page. Please check your internet connection.',
                    [
                      { text: 'Cancel', onPress: onClose },
                      { text: 'Retry', onPress: handleRetryPayment },
                    ]
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
