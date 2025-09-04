import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert,Modal, Pressable, Share } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useGetUser } from '@/api';
import { useGeneratePaymentLink,useGetSingleOrder } from '@/api/order';
//import { useInitializePayment, useInitializeOrderPayment } from '@/api/order/use-initialize-payment';
import { useInitializeOrderPayment } from '@/api/order/use-initialize-order-payment'; // ✅ New import
import { useVerifyPayment } from '@/api/order/use-verify-payment';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import LocationModal from '@/components/products/location-modal';
import { colors, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useModal } from '@/components/ui/modal';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { accessToken } from '@/lib';

// eslint-disable-next-line max-lines-per-function
function Checkout() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [checkoutUri, setCheckoutUri] = React.useState('');
  const [selectedAddress, setSelectedAddress] = React.useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<
    'payNow' | 'payOnDelivery'
  >('payNow');
  const [showDeliveryFeePopup, setShowDeliveryFeePopup] = React.useState(false);
  // const [deliveryFeeApplied, setDeliveryFeeApplied] = React.useState(false);
  const [isPartialPayment, setIsPartialPayment] = React.useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = React.useState(false);
  const [showCalculatingModal, setShowCalculatingModal] = React.useState(false);
  
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
  
  // Payment Link mutation
  const { mutate: generatePaymentLink, isPending: isGeneratingLink } = useGeneratePaymentLink();

  // Countdown timer effect
  React.useEffect(() => {
    if (!showPaymentLinkModal || !paymentLinkData?.remainingMinutes) return;

    // Initialize countdown with remaining minutes
    setCountdown({
      minutes: paymentLinkData.remainingMinutes,
      seconds: 0,
    });
    setCountdownInitialized(true);

    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          // Timer expired
          clearInterval(interval);
          return { minutes: 0, seconds: 0 };
        }

        if (prev.seconds === 0) {
          // Move to next minute
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Decrease seconds
          return { minutes: prev.minutes, seconds: prev.seconds - 1 };
        }
      });
    }, 1000);

    // Cleanup interval on unmount or when modal closes
    return () => {
      clearInterval(interval);
      setCountdownInitialized(false);
    };
  }, [showPaymentLinkModal, paymentLinkData?.remainingMinutes]);

  // Handle timer expiration
  React.useEffect(() => {
    if (
      countdownInitialized &&
      countdown.minutes === 0 &&
      countdown.seconds === 0 &&
      showPaymentLinkModal &&
      !isGeneratingNewLink
    ) {
      setShowPaymentLinkModal(false);
    }
  }, [countdownInitialized, countdown, showPaymentLinkModal, isGeneratingNewLink]);

  const {
    orderId,
    price,
    hasDeliveryFee,
    // productPrice: passedProductPrice,
  }: {
    orderId: string;
    price: string;
    hasDeliveryFee?: string;
    // productPrice?: string;
  } = useLocalSearchParams();

  const { data: order, isLoading: orderLoading } = useGetSingleOrder(
    Number(orderId)
  )();

  // Use order total price if available, otherwise use passed price
  const calculatedTotal = order?.order?.totalPrice || 0;
  // order?.order?.items?.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // ) || 0;

  // Split payment calculation for Pay on Delivery
  const isSplitPayment = selectedPaymentMethod === 'payOnDelivery';
  const deliveryFee = order?.order?.shipping?.totalShippingFee || 1000; // Fallback to fixed delivery fee if shipping not calculated

  const displayPrice =
    (order?.order?.amountDue || Number(price) || 0) - deliveryFee;

  // For split payment: use passed product price, otherwise calculate from order data
  // const productPrice = isSplitPayment
  //   ? Number(passedProductPrice) ||
  //     calculatedTotal ||
  //     order?.order?.totalPrice ||
  //     0
  //   : displayPrice;
  // const totalOrderValue = isSplitPayment
  //   ? productPrice + deliveryFee
  //   : displayPrice;
  // Amount to pay now - delivery fee for split payment, full amount for regular payment
  const amountToPayNow = isSplitPayment ? deliveryFee : calculatedTotal;
  // const remainingOnDelivery = isSplitPayment ? productPrice : 0;

  // Get the current address to display
  const currentAddress = React.useMemo(() => {
    if (selectedAddress) {
      return selectedAddress;
    }

    // Use the most recent address from addresses array, then fallback to default address
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
    // console.log('📍 Address saved:', address);
    setSelectedAddress(address);
    dismissAddressModal();
  };

  // Handle delivery fee selection
  const handlePayNowClick = () => {
    setSelectedPaymentMethod('payNow');
    setIsPartialPayment(false);
    setShowCalculatingModal(true);

    // Simulate calculation delay
    setTimeout(() => {
      setShowCalculatingModal(false);
      setShowDeliveryFeePopup(true);
    }, 2000);
  };

  const handlePayOnDeliveryClick = () => {
    setSelectedPaymentMethod('payOnDelivery');
    setIsPartialPayment(true);
    setShowCalculatingModal(true);

    // Simulate calculation delay
    setTimeout(() => {
      setShowCalculatingModal(false);
      setShowDeliveryFeePopup(true);
    }, 2000);
  };

  const handleDeliveryFeeProceed = () => {
    // setDeliveryFeeApplied(true);
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

  const handleDeliveryFeeCancel = () => {
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

  // Validate that we have a valid price
  if (!displayPrice || Number(displayPrice) === 0) {
    // console.log('⚠️ Warning: Invalid price detected:', {
    //   displayPrice,
    //   order,
    //   price,
    // });
  }

  const { mutate, isPending } = useInitializeOrderPayment({
    onSuccess: (data: any) => {
      console.log('🎯 SUCCESS - Full response:', JSON.stringify(data, null, 2));
      console.log('🎯 Authorization URL:', data.data?.authorizationUrl);
      console.log('🎯 Amount from response:', data.data?.amount);
      setCheckoutUri(data.data.authorizationUrl);
      setShowModal(true);
    },
    onError: (error) => {
      console.log('❌ ERROR - Full error:', JSON.stringify(error.response?.data, null, 2));
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { mutate: verifyMutate, isPending: verifyIsPending } = useVerifyPayment(
    {
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
    }
  );

  // const handlePayment = () => {
  //   setLoading(true);
    
  //   // Calculate correct amount based on order's payment type
  //   const correctAmount = order?.order?.shippingPaymentType === 'PAY_ON_DELIVERY' 
  //     ? order?.order?.shipping?.totalShippingFee || 0
  //     : Number(price);
      
  //   mutate({
  //     orderId: Number(orderId),
  //     email: user?.email || '',
  //     amount: correctAmount, // Send the correct amount
  //   });
  // };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/payment/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken()?.access}`,
        },
        body: JSON.stringify({ paymentMethod: 'CARD' })
      });
      
      const data = await response.json();
      console.log('🎯 HARDCODED RESPONSE:', JSON.stringify(data, null, 2));
      
      if (data.success && data.data.authorizationUrl) {
        setCheckoutUri(data.data.authorizationUrl);
        setShowModal(true);
      }
    } catch (error) {
      console.log('❌ HARDCODED ERROR:', error);
    }
    
    setLoading(false);
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
    
    // Prevent premature expiry handling during generation
    setIsGeneratingNewLink(true);
    setCountdownInitialized(false);

    // Close the modal to give a fresh start
    setShowPaymentLinkModal(false);
    
    generatePaymentLink(
      { orderId, ...(isSplitPayment ? { amount: Number(deliveryFee), paymentType: 'DELIVERY_FEE' as const } : {}) },
      {
        onSuccess: (data) => {
          console.log('🔍 Payment link success data:', data);
          console.log('🔍 Setting payment link data:', data.data);
          
          // Extract and normalize API data
          const apiData: any = data?.data || {};
          const rawExpiresAt = apiData.expiresAt || null;

          // Compute amount and formatted amount
          const normalizedAmount = isSplitPayment
            ? Number(deliveryFee)
            : (typeof apiData.amount === 'number' ? apiData.amount : Number(calculatedTotal));

          // Compute remaining minutes from expiresAt if present (fallback 15)
          let remainingMinutes = 15;
          if (rawExpiresAt) {
            try {
              const expiryMs = new Date(rawExpiresAt).getTime();
              const nowMs = Date.now();
              const diffMs = Math.max(0, expiryMs - nowMs);
              remainingMinutes = Math.max(0, Math.floor(diffMs / 60000));
            } catch {}
          }

          const paymentData = {
            orderId: apiData.orderId || orderId || 'N/A',
            amount: normalizedAmount,
            paymentLink: apiData.paymentLink || 'N/A',
            expiresAt: rawExpiresAt || 'N/A',
            customerName: user?.profile?.fullName || user?.email || 'N/A',
            formattedAmount: isSplitPayment ? `NGN ${deliveryFee}` : `NGN ${normalizedAmount}`,
            orderNumber: (apiData.paymentLinkId || orderId || 'N/A') as string,
            remainingMinutes,
            shareMessage: isSplitPayment
              ? `Please help me pay my delivery fee of NGN ${deliveryFee} for Order #${orderId}`
              : `Please help me pay NGN ${normalizedAmount} for Order #${orderId}`,
          };
          
          console.log('🔍 Extracted payment data:', paymentData);
          console.log('🔍 Setting modal to show');
          
          setPaymentLinkData(paymentData);
          setShowPaymentLinkModal(true);
          setIsGeneratingNewLink(false);
          
          console.log('🔍 Modal state should now be true');
        },
        onError: (error: any) => {
          console.log('❌ Payment link generation error:', error);
          console.log('❌ Error response:', error?.response);
          console.log('❌ Error data:', error?.response?.data);
          console.log('❌ Error message:', error?.response?.data?.message);
          setIsGeneratingNewLink(false);
          Alert.alert('Error', error?.response?.data?.message || 'Failed to generate payment link');
        },
      }
    );
    
    console.log('🔍 generatePaymentLink mutation called');
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
          // setShowModal(false);
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
                    // Get phone number from the most recent address or default address
                    const phoneNumber = user?.defaultAddress?.phoneNumber || 
                                     (user?.addresses && user.addresses.length > 0 ? 
                                      user.addresses[user.addresses.length - 1]?.phoneNumber : null) ||
                                     (user?.type === 'individual' ? user?.profile?.deliveryPhone : user?.phoneNumber);
                    
                    // If phone number already starts with +234, use it as is
                    if (phoneNumber?.startsWith('+234')) {
                      return phoneNumber;
                    }
                    // If phone number starts with 0, replace with +234
                    if (phoneNumber?.startsWith('0')) {
                      return '+234' + phoneNumber.substring(1);
                    }
                    // If phone number is 11 digits and doesn't start with 0, add +234
                    if (phoneNumber?.length === 11 && !phoneNumber.startsWith('0')) {
                      return '+234' + phoneNumber;
                    }
                    // Default fallback
                    return phoneNumber ? `+234 ${phoneNumber}` : 'No phone number';
                  })()}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  console.log(
                    '📍 Change Address pressed, current address:',
                    currentAddress
                  );
                  console.log('📍 Presenting address modal');
                  presentAddressModal();
                }}
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

          {/* ================================= */}
          {/* Payment Method Selection */}
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

            {/* Dropdown Options - Using Portal-like approach */}
            {showDeliveryDropdown && (
              <>
                {/* Backdrop overlay to cover bottom buttons */}
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
                          Pay Split Payment now; the remaining balance is due
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
            {isSplitPayment ? (
              // Split Payment Breakdown
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">
                    Total Order Value
                  </Text>
                  <Text className="text-[16px] font-medium">
                    {orderLoading
                      ? 'Loading...'
                      : `N${Number(calculatedTotal)?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">
                    Amount to Pay Now (Delivery Fee)
                  </Text>
                  <Text className="text-[16px] font-medium text-green-600">
                    N{deliveryFee?.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">
                    Remaining Payment on Delivery
                  </Text>
                  <Text className="text-[16px] font-medium text-orange-600">
                    N{(calculatedTotal - deliveryFee)?.toLocaleString()}
                  </Text>
                </View>
                <View className="mt-4 flex-row items-center justify-between border-t border-gray-200 pt-4">
                  <Text className="text-[18px] font-semibold">
                    Amount Due Now
                  </Text>
                  <Text className="text-[18px] font-semibold text-green-600">
                    N{amountToPayNow?.toLocaleString()}
                  </Text>
                </View>
              </>
            ) : (
              // Regular Payment Breakdown
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">
                    {hasDeliveryFee === 'true' ? 'Total amount' : 'Subtotal'}
                  </Text>
                  <Text className="text-[16px] font-medium">
                    {orderLoading
                      ? 'Loading...'
                      : `N${Number(displayPrice)?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-5">
                  <Text className="text-[16px] opacity-65">VAT</Text>
                  <Text className="text-[16px] font-medium">N0.00</Text>
                </View>
                <View className="flex-row items-center justify-between pb-5">
                  <Text className="text-[16px] opacity-65">Discount</Text>
                  <Text className="text-[16px] font-medium">N0.00</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">Shipping</Text>
                  <Text className="text-[16px] font-medium">
                    N{deliveryFee?.toLocaleString()}
                  </Text>
                </View>

                <View className="mt-4 flex-row items-center justify-between border-t border-gray-200 pt-4">
                  <Text className="text-[18px] font-semibold">Order Total</Text>
                  <Text className="text-[18px] font-semibold">
                    {orderLoading
                      ? 'Loading...'
                      : `N${Number(calculatedTotal)?.toLocaleString()}`}
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
          loading={loading || isPending || verifyIsPending}
          disabled={
            loading || isPending || verifyIsPending || !selectedPaymentMethod
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
              <View className="mb-4 size-12 rounded-full border-4 border-orange-500 border-t-transparent" />
              <Text className="text-center text-[18px] font-bold text-gray-800">
                Calculating...
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
                NGN {isPartialPayment ? deliveryFee : amountToPayNow}
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
              <View className="p-4">
                <Text className="text-lg font-semibold text-center mb-4">
                  Payment Link Generated
                </Text>
                
                                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Order Details:</Text>
                    <Text className="text-base font-medium">
                      Order #{paymentLinkData.orderNumber} - {paymentLinkData.customerName}
                    </Text>
                    <Text className="text-lg font-bold text-green-600">
                      {isSplitPayment ? `NGN ${deliveryFee}` : paymentLinkData.formattedAmount}
                    </Text>
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-sm text-gray-500">
                      Expires in {countdown.minutes} minutes
                    </Text>
                    <View className={`px-2 py-1 rounded ${
                      countdown.minutes === 0 && countdown.seconds === 0 
                        ? 'bg-red-200' 
                        : countdown.minutes < 5 
                        ? 'bg-orange-100' 
                        : 'bg-red-100'
                    }`}>
                      <Text className={`text-sm font-mono ${
                        countdown.minutes === 0 && countdown.seconds === 0 
                          ? 'text-red-800' 
                          : countdown.minutes < 5 
                          ? 'text-orange-600' 
                          : 'text-red-600'
                      }`}>
                        {countdown.minutes === 0 && countdown.seconds === 0 
                          ? 'EXPIRED' 
                          : `${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}`
                        }
                      </Text>
                    </View>
                  </View>
                  {countdown.minutes < 5 && countdown.minutes > 0 && (
                    <Text className="text-xs text-orange-600 mt-1">
                      ⚠️ Payment link expires soon!
                    </Text>
                  )}
                  {countdown.minutes === 0 && countdown.seconds === 0 && (
                    <Text className="text-xs text-red-600 mt-1">
                      ❌ Payment link has expired
                    </Text>
                  )}
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
                  className="w-full border-gray-300"
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
          </View>
        </Modal>
      )}
    </Container.Page>
  );
}

export default Checkout;
