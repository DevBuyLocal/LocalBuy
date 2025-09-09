import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Share } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useGetUser } from '@/api';
import { useGeneratePaymentLink, useGetSingleOrder, usePollPaymentStatus } from '@/api/order';
import { useInitializeOrderPayment } from '@/api/order/use-initialize-order-payment';
import { useUpdateOrderPayment } from '@/api/order/use-update-order-payment';
import { useVerifyPayment } from '@/api/order/use-verify-payment';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import LocationModal from '@/components/products/location-modal';
import { colors, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useModal } from '@/components/ui/modal';
import { useLoader } from '@/lib/hooks/general/use-loader';

// eslint-disable-next-line max-lines-per-function
function Checkout() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [checkoutUri, setCheckoutUri] = React.useState('');
  const [selectedAddress, setSelectedAddress] = React.useState<string>('');
  
  // ✅ Payment selection state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<
    'payNow' | 'payOnDelivery'
  >('payNow');
  const [showDeliveryDropdown, setShowDeliveryDropdown] = React.useState(false);
  const [showCalculatingModal, setShowCalculatingModal] = React.useState(false);
  const [showDeliveryFeePopup, setShowDeliveryFeePopup] = React.useState(false);
  
  // Payment Link states
  const [showPaymentLinkModal, setShowPaymentLinkModal] = React.useState(false);
  const [isGeneratingNewLink, setIsGeneratingNewLink] = React.useState(false);
  const [paymentLinkData, setPaymentLinkData] = React.useState<{
    orderId: string | number;
    amount: string | number;
    paymentLink: string;
    expiresAt: string;
    customerName: string;
    formattedAmount: string;
    orderNumber: string;
    remainingMinutes: number;
    shareMessage: string;
  } | null>(null);
  
  // Payment Success Dialog state
  const [showPaymentSuccessDialog, setShowPaymentSuccessDialog] = React.useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = React.useState<{
    orderNumber: string;
    amount: string;
    paidAt: string;
  } | null>(null);
  
  // Countdown timer state
  const [countdown, setCountdown] = React.useState<{
    minutes: number;
    seconds: number;
  }>({ minutes: 0, seconds: 0 });
  const [countdownInitialized, setCountdownInitialized] = React.useState(false);

  const { replace } = useRouter();
  const { data: user, isLoading: userLoading, refetch } = useGetUser();
  
  const { setError, loading, setLoading, setSuccess } = useLoader({
    showLoadingPage: true,
  });
  const {
    ref: addressModalRef,
    present: presentAddressModal,
    dismiss: dismissAddressModal,
  } = useModal();

  const webViewRef = React.useRef<WebView>(null);
  
  // ✅ New hook for updating order payment type
  const { mutate: updateOrderPayment, isPending: isUpdatingOrder } = useUpdateOrderPayment();
  
  // Payment Link mutation
  const { mutate: generatePaymentLink, isPending: isGeneratingLink } = useGeneratePaymentLink();

  const {
    orderId,
    price,
    hasDeliveryFee,
  }: {
    orderId: string;
    price: string;
    hasDeliveryFee?: string;
  } = useLocalSearchParams();

  const { data: order, isLoading: orderLoading, refetch: refetchOrder } = useGetSingleOrder(
    Number(orderId)
  )();

  // ✅ Initialize payment method from order data
  React.useEffect(() => {
    if (order?.order?.shippingPaymentType) {
      const paymentMethod = order.order.shippingPaymentType === 'PAY_ON_DELIVERY' 
        ? 'payOnDelivery' 
        : 'payNow';
      setSelectedPaymentMethod(paymentMethod);
    }
  }, [order?.order?.shippingPaymentType]);

  // Poll payment status when payment link is active
  const { data: paymentStatus, isLoading: paymentStatusLoading } = usePollPaymentStatus(
    Number(orderId),
    showPaymentLinkModal && paymentLinkData !== null
  );

  // Handle payment status updates
  React.useEffect(() => {
    if (paymentStatus?.data?.paymentStatus === 'PAID') {
      console.log('🎉 Payment completed through shared link!');
      
      setShowPaymentLinkModal(false);
      setPaymentLinkData(null);
      
      setPaymentSuccessData({
        orderNumber: paymentLinkData?.orderNumber || orderId.toString(),
        amount: paymentLinkData?.formattedAmount || `₦${paymentStatus.data.amount?.toLocaleString() || '0'}`,
        paidAt: paymentStatus.data.paidAt || new Date().toISOString(),
      });
      
      setTimeout(() => {
        setShowPaymentSuccessDialog(true);
      }, 300);
    }
  }, [paymentStatus, paymentLinkData, orderId, setError]);

  // ✅ Calculate payment details from order
  const isPartialPayment = order?.order?.shippingPaymentType === 'PAY_ON_DELIVERY';
  const deliveryFee = order?.order?.shipping?.totalShippingFee || 0;
  const totalOrderValue = order?.order?.totalPrice || 0;
  const amountToPayNow = isPartialPayment ? deliveryFee : totalOrderValue;
  const remainingOnDelivery = isPartialPayment ? (totalOrderValue - deliveryFee) : 0;

  // Get the current address to display
  const currentAddress = React.useMemo(() => {
    if (selectedAddress) {
      return selectedAddress;
    }

    const mostRecentAddress = user?.addresses && user.addresses.length > 0 
      ? user.addresses[user.addresses.length - 1]?.addressLine1 
      : null;
    const defaultAddress = user?.defaultAddress?.addressLine1;
    const profileAddress =
      user?.type === 'individual' ? user?.profile?.address : user?.phoneNumber;

    return mostRecentAddress || defaultAddress || profileAddress || '';
  }, [
    selectedAddress,
    user?.addresses,
    user?.defaultAddress?.addressLine1,
    user?.type,
    user?.profile?.address,
    user?.phoneNumber,
  ]);

  // Handle address selection
  const handleAddressSaved = (address: string) => {
    setSelectedAddress(address);
    dismissAddressModal();
  };

  // ✅ Handle payment method changes
  const handlePayNowClick = () => {
    setSelectedPaymentMethod('payNow');
    setShowCalculatingModal(true);
    
    // Update the order payment type
    updateOrderPayment(
      {
        orderId: Number(orderId),
        shippingPaymentType: 'PAY_NOW'
      },
      {
        onSuccess: () => {
          setShowCalculatingModal(false);
          setShowDeliveryFeePopup(true);
          refetchOrder(); // Refresh order data
        },
        onError: (error: any) => {
          setShowCalculatingModal(false);
          setError(error?.response?.data?.message || 'Failed to update payment method');
        }
      }
    );
  };

  const handlePayOnDeliveryClick = () => {
    setSelectedPaymentMethod('payOnDelivery');
    setShowCalculatingModal(true);
    
    // Update the order payment type
    updateOrderPayment(
      {
        orderId: Number(orderId),
        shippingPaymentType: 'PAY_ON_DELIVERY'
      },
      {
        onSuccess: () => {
          setShowCalculatingModal(false);
          setShowDeliveryFeePopup(true);
          refetchOrder(); // Refresh order data
        },
        onError: (error: any) => {
          setShowCalculatingModal(false);
          setError(error?.response?.data?.message || 'Failed to update payment method');
        }
      }
    );
  };

  const handleDeliveryFeeProceed = () => {
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

  const handleDeliveryFeeCancel = () => {
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

  const { mutate, isPending } = useInitializeOrderPayment({
    onSuccess: (data: any) => {
      console.log('🎯 Payment initialized:', {
        amount: data.data?.amount,
        isPartialPayment: data.meta?.isPartialPayment
      });
      setCheckoutUri(data.data.authorizationUrl);
      setShowModal(true);
    },
    onError: (error) => {
      console.log('❌ Payment error:', error.response?.data);
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutate: verifyMutate, isPending: verifyIsPending } = useVerifyPayment({
    onSuccess: () => {
      setSuccess('Payment successful');
      replace(`/order-success?orderId=${orderId}`);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // ✅ Payment handler
  const handlePayment = () => {
    console.log('🎯 Starting payment:', {
      orderId,
      selectedPaymentMethod,
      orderPaymentType: order?.order?.shippingPaymentType,
      amountToPayNow
    });
    
    setLoading(true);
    
    mutate({
      orderId: Number(orderId),
      paymentMethod: 'CARD',
    });
  };
  
  const handleNavigationStateChange = React.useCallback(
    (state: WebViewNavigation) => {
      if (state.url === 'https://standard.paystack.co/close') {
        setShowModal(false);
      }
    },
    []
  );

  const handleError = React.useCallback(
    (error: any) => {
      setShowModal(false);
      setError(error);
    },
    [setError]
  );

  // Payment Link handlers
  const handleGeneratePaymentLink = () => {
    if (!orderId) {
      Alert.alert('Error', 'Order ID not found');
      return;
    }
    
    setIsGeneratingNewLink(true);
    setCountdownInitialized(false);
    setShowPaymentLinkModal(false);
    
    generatePaymentLink(
      { 
        orderId, 
        ...(isPartialPayment ? { 
          amount: Number(deliveryFee), 
          paymentType: 'DELIVERY_FEE' as const 
        } : {}) 
      },
      {
        onSuccess: (data) => {
          console.log('🔍 Payment link generated');
          const apiData: any = data?.data || {};
          
          const paymentData = {
            orderId: apiData.orderId || orderId || 'N/A',
            amount: isPartialPayment ? Number(deliveryFee) : Number(totalOrderValue),
            paymentLink: apiData.paymentLink || 'N/A',
            expiresAt: apiData.expiresAt || 'N/A',
            customerName: user?.profile?.fullName || user?.email || 'N/A',
            formattedAmount: isPartialPayment ? `₦${deliveryFee}` : `₦${totalOrderValue}`,
            orderNumber: orderId as string,
            remainingMinutes: 15,
            shareMessage: isPartialPayment
              ? `Please help me pay my delivery fee of ₦${deliveryFee} for Order #${orderId}`
              : `Please help me pay ₦${totalOrderValue} for Order #${orderId}`,
          };
          
          setPaymentLinkData(paymentData);
          setShowPaymentLinkModal(true);
          setIsGeneratingNewLink(false);
        },
        onError: (error: any) => {
          console.log('❌ Payment link error:', error);
          setIsGeneratingNewLink(false);
          Alert.alert('Error', 'Failed to generate payment link');
        },
      }
    );
  };

  const handleSharePaymentLink = async () => {
    if (!paymentLinkData?.paymentLink) return;
    
    try {
      await Share.share({
        message: `${paymentLinkData.shareMessage}\n\nPayment Link: ${paymentLinkData.paymentLink}`,
        title: 'Pay for My Order',
      });
    } catch (error) {
      console.log('Error sharing payment link:', error);
    }
  };

  const handleMessageReceived = React.useCallback(
    (data: string) => {
      const webResponse = JSON.parse(data);

      switch (webResponse.event) {
        case 'close':
          setShowModal(false);
          break;
        case 'success':
          verifyMutate({ reference: webResponse.data.reference });
          setShowModal(false);
          break;
        case 'error':
          setError(
            webResponse.data.message || 'An error occurred during payment.'
          );
          setShowModal(false);
          break;
        default:
          break;
      }
    },
    [setError, verifyMutate]
  );

  return (
    <Container.Page showHeader headerTitle="Your order">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={showDeliveryDropdown ? "pb-80" : "pb-40"}
      >
        <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
          <Text className="my-5 text-[16px] font-medium">Shipping address</Text>
          <View className="rounded-lg bg-white p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="mb-2 text-[16px] font-semibold">
                  {user?.profile?.fullName || user?.email}
                </Text>
                <Text className="w-[90%] text-[16px] opacity-75">
                  {userLoading
                    ? 'Loading address...'
                    : currentAddress ||
                      'No delivery address set. Please add an address to continue.'}
                </Text>
                <Text className="mt-5 text-[16px] opacity-85">
                  {(() => {
                    const phoneNumber = user?.defaultAddress?.phoneNumber || 
                                     (user?.addresses && user.addresses.length > 0 ? 
                                      user.addresses[user.addresses.length - 1]?.phoneNumber : null) ||
                                     (user?.type === 'individual' ? user?.profile?.deliveryPhone : user?.phoneNumber);
                    
                    if (phoneNumber?.startsWith('+234')) {
                      return phoneNumber;
                    }
                    if (phoneNumber?.startsWith('0')) {
                      return '+234' + phoneNumber.substring(1);
                    }
                    if (phoneNumber?.length === 11 && !phoneNumber.startsWith('0')) {
                      return '+234' + phoneNumber;
                    }
                    return phoneNumber ? `+234 ${phoneNumber}` : 'No phone number';
                  })()}
                </Text>
              </View>
              <Pressable
                onPress={() => presentAddressModal()}
                disabled={userLoading}
                className={`ml-4 rounded-lg px-3 py-2 ${
                  userLoading ? 'bg-gray-200' : 'bg-blue-50'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    userLoading ? 'text-gray-500' : 'text-blue-600'
                  }`}
                >
                  Change Address
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ✅ Payment Method Selection */}
          <Text className="mt-8 text-[16px] font-medium">Payment Method</Text>
          <View className="mb-2 mt-4" style={{ position: 'relative', zIndex: 9999 }}>
            {/* Delivery Dropdown */}
            <Pressable
              onPress={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
              className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white p-3"
            >
              <Text className="text-[14px]">
                {selectedPaymentMethod === 'payNow'
                  ? 'Pay Now (Full Payment)'
                  : selectedPaymentMethod === 'payOnDelivery'
                    ? 'Pay on Delivery (Split Payment)'
                    : 'Select Payment Method'}
              </Text>
              <Ionicons
                name={showDeliveryDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </Pressable>

            {/* Dropdown Options */}
            {showDeliveryDropdown && (
              <>
                {/* Backdrop overlay */}
                <View 
                  className="fixed inset-0 bg-transparent"
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    elevation: 100
                  }}
                  onTouchEnd={() => setShowDeliveryDropdown(false)}
                />
                
                {/* Dropdown content */}
                <View 
                  className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-gray-200 bg-white shadow-lg"
                  style={{ 
                    zIndex: 101, 
                    elevation: 101,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8
                  }}
                >
                <Pressable
                  onPress={() => {
                    handlePayNowClick();
                    setShowDeliveryDropdown(false);
                  }}
                  className="border-b border-gray-100 p-3"
                >
                  <View className="flex-row items-start gap-3">
                    <View className="mt-1">
                      <View
                        className={`size-4 items-center justify-center rounded-full border-2 ${
                          selectedPaymentMethod === 'payNow'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPaymentMethod === 'payNow' && (
                          <View className="size-2 rounded-full bg-white" />
                        )}
                      </View>
                    </View>
                    <View className="flex-1">
                      <View className="mb-1 flex-row items-center gap-2">
                        <Text className="text-[12px] font-medium text-gray-500">
                          Option 1
                        </Text>
                        <Text className="text-[14px] font-semibold">
                          Pay Now (Full Payment)
                        </Text>
                      </View>
                      <Text className="mb-1 text-[12px] font-bold text-gray-700">
                        (Pay for both product and delivery now.)
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons
                          name="information-circle"
                          size={12}
                          color="#f97316"
                        />
                        <Text className="text-[11px] text-gray-600">
                          Covers full delivery cost upfront. No extra charges
                          upon delivery.
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handlePayOnDeliveryClick();
                    setShowDeliveryDropdown(false);
                  }}
                  className="p-3"
                >
                  <View className="flex-row items-start gap-3">
                    <View className="mt-1">
                      <View
                        className={`size-4 items-center justify-center rounded-full border-2 ${
                          selectedPaymentMethod === 'payOnDelivery'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPaymentMethod === 'payOnDelivery' && (
                          <View className="size-2 rounded-full bg-white" />
                        )}
                      </View>
                    </View>
                    <View className="flex-1">
                      <View className="mb-1 flex-row items-center gap-2">
                        <Text className="text-[12px] font-medium text-gray-500">
                          Option 2
                        </Text>
                        <Text className="text-[14px] font-semibold">
                          Pay on Delivery (Split Payment)
                        </Text>
                      </View>
                      <Text className="mb-1 text-[12px] font-bold text-gray-700">
                        (Pay the delivery fee now, and pay for the product when
                        it's delivered)
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons
                          name="information-circle"
                          size={12}
                          color="#f97316"
                        />
                        <Text className="text-[11px] text-gray-600">
                          Pay delivery fee now; the remaining balance is due
                          upon delivery.
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
                </View>
              </>
            )}
          </View>

          {/* Payment Method Note */}
          {!selectedPaymentMethod && (
            <View className="mt-2 flex-row items-center gap-2">
              <Ionicons name="warning" size={16} color="#f97316" />
              <Text className="text-[12px] text-gray-600">
                Select a payment method before checkout.
              </Text>
            </View>
          )}

          {/* ================================= */}
          <Text className="mt-8 text-[16px] font-medium">Order summary</Text>
          <View className="mt-4 rounded-lg bg-white p-5">
            {isPartialPayment ? (
              // Split Payment Breakdown
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">
                    Total Order Value
                  </Text>
                  <Text className="text-[16px] font-medium">
                    {orderLoading
                      ? 'Loading...'
                      : `₦${totalOrderValue?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">
                    Amount to Pay Now (Delivery Fee)
                  </Text>
                  <Text className="text-[16px] font-medium text-green-600">
                    ₦{deliveryFee?.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">
                    Remaining Payment on Delivery
                  </Text>
                  <Text className="text-[16px] font-medium text-orange-600">
                    ₦{remainingOnDelivery?.toLocaleString()}
                  </Text>
                </View>
                <View className="mt-4 flex-row items-center justify-between border-t border-gray-200 pt-4">
                  <Text className="text-[18px] font-semibold">
                    Amount Due Now
                  </Text>
                  <Text className="text-[18px] font-semibold text-green-600">
                    ₦{amountToPayNow?.toLocaleString()}
                  </Text>
                </View>
              </>
            ) : (
              // Regular Payment Breakdown
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">
                    Product Subtotal
                  </Text>
                  <Text className="text-[16px] font-medium">
                    {orderLoading
                      ? 'Loading...'
                      : `₦${(totalOrderValue - deliveryFee)?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-5">
                  <Text className="text-[16px] opacity-65">VAT</Text>
                  <Text className="text-[16px] font-medium">₦0.00</Text>
                </View>
                <View className="flex-row items-center justify-between pb-5">
                  <Text className="text-[16px] opacity-65">Discount</Text>
                  <Text className="text-[16px] font-medium">₦0.00</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">Shipping</Text>
                  <Text className="text-[16px] font-medium">
                    ₦{deliveryFee?.toLocaleString()}
                  </Text>
                </View>

                <View className="mt-4 flex-row items-center justify-between border-t border-gray-200 pt-4">
                  <Text className="text-[18px] font-semibold">Order Total</Text>
                  <Text className="text-[18px] font-semibold">
                    {orderLoading
                      ? 'Loading...'
                      : `₦${totalOrderValue?.toLocaleString()}`}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Container.Box>
      </ScrollView>

      {!showDeliveryDropdown && (
        <View className="absolute bottom-12 w-[90%] self-center">
          <CustomButton
            label="Pay for Me"
            onPress={handleGeneratePaymentLink}
            loading={isGeneratingLink}
            variant="outline"
            className="mb-3 h-[55px] border-orange-500"
            textClassName="text-orange-500"
          />
          <CustomButton
            label="Continue"
            onPress={handlePayment}
            loading={loading || isPending || verifyIsPending || isUpdatingOrder}
            disabled={
              loading || isPending || verifyIsPending || !selectedPaymentMethod || isUpdatingOrder
            }
          />
        </View>
      )}

      <Modal
        style={{ flex: 1 }}
        visible={showModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView className="flex-1 p-5" edges={['top']}>
          <WebView
            source={{ uri: checkoutUri }}
            onMessage={(e) => {
              handleMessageReceived(e.nativeEvent.data);
            }}
            onError={handleError}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            ref={webViewRef}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled={true}
            startInLoadingState={true}
            style={{ backgroundColor: 'transparent' }}
            injectedJavaScript={`
              window.addEventListener('message', function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
              });
              true;
            `}
          />
          {isLoading && (
            <View className="items-center justify-center">
              <ActivityIndicator size="large" color={colors.primaryText} />
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Calculating Modal */}
      {showCalculatingModal && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/50 px-4"
          style={{ zIndex: 9999 }}
        >
          <View className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <View className="items-center">
              <View className="mb-4 size-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              <Text className="text-center text-[18px] font-bold text-gray-800">
                Updating Payment Method...
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Delivery Fee Popup */}
      {showDeliveryFeePopup && (
        <View
          className="absolute inset-0 items-center justify-center bg-black/50 px-4"
          style={{ zIndex: 9999 }}
        >
          <View className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <Text className="mb-4 text-center text-[18px] font-bold text-gray-800">
              Amount to Pay Now
            </Text>

            <View className="mb-6">
              <Text className="mb-4 text-center text-[24px] font-bold text-gray-800">
                ₦{amountToPayNow?.toLocaleString()}
              </Text>
              <Text className="text-center text-[14px] text-gray-600">
                {isPartialPayment 
                  ? `Delivery fee only. ₦${remainingOnDelivery?.toLocaleString()} will be paid on delivery.`
                  : 'Full payment including products and delivery.'
                }
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleDeliveryFeeCancel}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDeliveryFeeProceed}
                className="flex-1 rounded-lg bg-orange-500 px-4 py-3"
              >
                <Text className="text-center font-semibold text-white">
                  Proceed
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Address Selection Modal */}
      <LocationModal
        ref={addressModalRef}
        onAddressSaved={handleAddressSaved}
        initialAddress={currentAddress || ''}
        onDismiss={dismissAddressModal}
        dismiss={dismissAddressModal}
        refetch={refetch}
      />

      {/* Payment Link Modal */}
      {showPaymentLinkModal && paymentLinkData && (
        <Modal
          visible={showPaymentLinkModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowPaymentLinkModal(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-4">
            <View className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <Text className="text-lg font-semibold text-center mb-4">
                Payment Link Generated
              </Text>
              
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Order Details:</Text>
                <Text className="text-base font-medium">
                  Order #{paymentLinkData.orderNumber} - {paymentLinkData.customerName}
                </Text>
                <Text className="text-lg font-bold text-green-600">
                  {paymentLinkData.formattedAmount}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">Payment Link:</Text>
                <Text className="text-xs text-gray-700 bg-gray-100 p-2 rounded">
                  {paymentLinkData.paymentLink}
                </Text>
              </View>

              <CustomButton
                label="Share Link"
                onPress={handleSharePaymentLink}
                className="mb-3 w-full border-gray-300"
                textClassName="text-gray-700"
                variant="outline"
              />

              <CustomButton
                label="Close"
                onPress={() => setShowPaymentLinkModal(false)}
                variant="outline"
                className="w-full border-orange-500"
                textClassName="text-orange-500"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Payment Success Dialog */}
      {showPaymentSuccessDialog && paymentSuccessData && (
        <Modal
          visible={showPaymentSuccessDialog}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowPaymentSuccessDialog(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-4">
            <View className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <View className="items-center">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Text className="text-3xl">✅</Text>
                </View>
                
                <Text className="mb-2 text-xl font-bold text-gray-900">
                  Payment Successful!
                </Text>
                
                <Text className="mb-4 text-center text-gray-600">
                  Your payment has been completed successfully.
                </Text>
                
                <View className="mb-6 w-full rounded-lg bg-gray-50 p-4">
                  <Text className="mb-2 text-sm font-medium text-gray-700">Payment Details:</Text>
                  <View className="space-y-1">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Order:</Text>
                      <Text className="text-sm font-medium">#{paymentSuccessData.orderNumber}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Amount:</Text>
                      <Text className="text-sm font-bold text-green-600">{paymentSuccessData.amount}</Text>
                    </View>
                  </View>
                </View>
                
                <View className="w-full space-y-3">
                  <CustomButton
                    label="View Order Details"
                    onPress={() => {
                      setShowPaymentSuccessDialog(false);
                      replace(`/order-success?orderId=${orderId}`);
                    }}
                    className="w-full"
                  />
                  
                  <CustomButton
                    label="Continue Shopping"
                    onPress={() => {
                      setShowPaymentSuccessDialog(false);
                      replace('/(main)/(tabs)');
                    }}
                    variant="outline"
                    className="w-full border-gray-300"
                    textClassName="text-gray-700"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Container.Page>
  );
}

export default Checkout;
