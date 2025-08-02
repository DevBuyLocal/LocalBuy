import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Modal, Pressable } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useGetUser } from '@/api';
import { useInitializePayment } from '@/api/order/use-initialize-payment';
import { useVerifyPayment } from '@/api/order/use-verify-payment';
import { useGetSingleOrder } from '@/api/order/use-get-single-order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import LocationModal from '@/components/products/location-modal';
import { colors, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

// eslint-disable-next-line max-lines-per-function
function Checkout() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [checkoutUri, setCheckoutUri] = React.useState('');
  const [selectedAddress, setSelectedAddress] = React.useState<string>('');
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'card' | 'ussd' | 'transfer'>('card');
  const { replace } = useRouter();
  const { data: user, isLoading: userLoading, refetch } = useGetUser();
  const { setError, loading, setLoading, setSuccess } = useLoader({
    showLoadingPage: true,
  });

  const webViewRef = React.useRef<WebView>(null);

  const {
    orderId,
    price,
    hasDeliveryFee,
    paymentMethod,
    productPrice: passedProductPrice,
  }: { orderId: string; price: string; hasDeliveryFee?: string; paymentMethod?: string; productPrice?: string } =
    useLocalSearchParams();

  const { data: order, isLoading: orderLoading } = useGetSingleOrder({
    variables: { orderId: Number(orderId) },
  });

  // Debug logging
  console.log('🔍 Checkout Debug:', {
    orderId,
    orderIdType: typeof orderId,
    passedPrice: price,
    passedPriceType: typeof price,
    orderData: order,
    orderTotalPrice: order?.order?.totalPrice,
    finalPrice: order?.order?.totalPrice || price
  });

  // Use order total price if available, otherwise use passed price
  const calculatedTotal = order?.order?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const displayPrice = calculatedTotal > 0 ? calculatedTotal : (order?.order?.totalPrice || Number(price) || 0);

  // Split payment calculation for Pay on Delivery
  const isSplitPayment = paymentMethod === 'payOnDelivery';
  const deliveryFee = 1000; // Fixed delivery fee
  
  // For split payment: use passed product price, otherwise calculate from order data
  const productPrice = isSplitPayment 
    ? (Number(passedProductPrice) || calculatedTotal || order?.order?.totalPrice || 0)
    : displayPrice;
  const totalOrderValue = isSplitPayment ? (productPrice + deliveryFee) : displayPrice;
  const amountToPayNow = isSplitPayment ? deliveryFee : displayPrice;
  const remainingOnDelivery = isSplitPayment ? productPrice : 0;

  // Additional debug for price comparison
  console.log('💰 Checkout Price Debug:', {
    orderTotalPrice: order?.order?.totalPrice,
    passedPrice: price,
    passedProductPrice,
    calculatedTotal,
    displayPrice,
    isSplitPayment,
    productPrice,
    totalOrderValue,
    amountToPayNow,
    remainingOnDelivery,
    orderItems: order?.order?.items?.length || 0,
    orderItemsDetails: order?.order?.items?.map(item => ({
      productName: item.product?.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })) || [],
    priceSource: calculatedTotal > 0 ? 'calculated from items' : 'order total or passed price'
  });

  // Get the current address to display
  const currentAddress = React.useMemo(() => {
    if (selectedAddress) {
      return selectedAddress;
    }
    
    // Prioritize default address, then profile address
    const defaultAddress = user?.defaultAddress?.addressLine1;
    const profileAddress = user?.type === 'individual'
      ? user?.profile?.address
      : user?.profile?.businessAddress;
    
    return defaultAddress || profileAddress || '';
  }, [selectedAddress, user?.type, user?.profile?.address, user?.profile?.businessAddress, user?.defaultAddress?.addressLine1]);

  // Debug user data
  console.log('🔍 Checkout User Debug:', {
    userType: user?.type,
    userProfile: user?.profile,
    individualAddress: user?.profile?.address,
    businessAddress: user?.profile?.businessAddress,
    defaultAddress: user?.defaultAddress,
    currentAddress,
    selectedAddress
  });

  // Debug modal state
  console.log('🔍 Checkout Modal State:', {
    showAddressModal,
    selectedAddress,
    currentAddress
  });

  // Handle address selection
  const handleAddressSaved = (address: string) => {
    console.log('📍 Address saved:', address);
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  // Validate that we have a valid price
  if (!displayPrice || Number(displayPrice) === 0) {
    console.log('⚠️ Warning: Invalid price detected:', { displayPrice, order, price });
  }

  const { mutate, isPending } = useInitializePayment({
    onSuccess: (data: any) => {
      setCheckoutUri(data.authorizationUrl);
      setShowModal(true);
    },
    onError: (error) => {
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

  const handlePayment = () => {
    if (!currentAddress) {
      setError('Please select a delivery address before proceeding');
      return;
    }
    
    console.log('💳 Payment method selected:', selectedPaymentMethod);
    
    setLoading(true);
    mutate({
      orderId: Number(orderId),
      email: user?.email || '',
      amount: Number(displayPrice),
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
        contentContainerClassName="flex-1"
      >
        <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
          <Text className="my-5 text-[16px] font-medium">Shipping address</Text>
          <View className="rounded-lg bg-white p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="mb-2 text-[16px] font-semibold">
                  {user?.profile?.fullName ||
                    user?.businessProfile?.name ||
                    user?.email}
                </Text>
                <Text className="w-[90%] text-[16px] opacity-75">
                  {userLoading ? (
                    'Loading address...'
                  ) : (
                    currentAddress || 'No delivery address set. Please add an address to continue.'
                  )}
                </Text>
                <Text className="mt-5 text-[16px] opacity-85">
                  +234{' '}
                  {user?.type === 'individual'
                    ? user?.profile?.deliveryPhone
                    : user?.profile?.businessPhone}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  console.log('📍 Change Address pressed, current address:', currentAddress);
                  console.log('📍 Setting showAddressModal to true');
                  setShowAddressModal(true);
                }}
                disabled={userLoading}
                className={`ml-4 rounded-lg px-3 py-2 ${
                  userLoading ? 'bg-gray-200' : 'bg-blue-50'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  userLoading ? 'text-gray-500' : 'text-blue-600'
                }`}>
                  Change Address
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ================================= */}
          <Text className="mt-8 text-[16px] font-medium">Order summary</Text>
          <View className="mt-4 rounded-lg bg-white p-5">
            {isSplitPayment ? (
              // Split Payment Breakdown
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">Total Order Value</Text>
                  <Text className="text-[16px] font-medium">
                    {orderLoading ? 'Loading...' : `N${Number(totalOrderValue)?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">Amount to Pay Now (Delivery Fee)</Text>
                  <Text className="text-[16px] font-medium text-green-600">
                    N{deliveryFee?.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-3">
                  <Text className="text-[16px] opacity-65">Remaining Payment on Delivery</Text>
                  <Text className="text-[16px] font-medium text-orange-600">
                    N{remainingOnDelivery?.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <Text className="text-[18px] font-semibold">Amount Due Now</Text>
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
                    {orderLoading ? 'Loading...' : `N${Number(displayPrice)?.toLocaleString()}`}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between py-5">
                  <Text className="text-[16px] opacity-65">VAT</Text>
                  <Text className="text-[16px] font-medium">N0.00</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] opacity-65">Discount</Text>
                  <Text className="text-[16px] font-medium">N0.00</Text>
                </View>
                <View className="flex-row items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <Text className="text-[18px] font-semibold">Order Total</Text>
                  <Text className="text-[18px] font-semibold">
                    {orderLoading ? 'Loading...' : `N${Number(displayPrice)?.toLocaleString()}`}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* ================================= */}
          <Text className="mt-8 text-[16px] font-medium">Payment Method</Text>
          <View className="mt-4 rounded-lg bg-white p-5">
            <View className="space-y-4">
              {/* Debit Card Option */}
              <Pressable
                onPress={() => setSelectedPaymentMethod('card')}
                className={`flex-row items-center p-3 rounded-lg border ${
                  selectedPaymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedPaymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === 'card' && (
                    <View className="w-2 h-2 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text className="text-[16px] font-medium">Debit Card</Text>
              </Pressable>

              {/* USSD Option */}
              <Pressable
                onPress={() => setSelectedPaymentMethod('ussd')}
                className={`flex-row items-center p-3 rounded-lg border ${
                  selectedPaymentMethod === 'ussd'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedPaymentMethod === 'ussd'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === 'ussd' && (
                    <View className="w-2 h-2 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text className="text-[16px] font-medium">USSD</Text>
              </Pressable>

              {/* Bank Transfer Option */}
              <Pressable
                onPress={() => setSelectedPaymentMethod('transfer')}
                className={`flex-row items-center p-3 rounded-lg border ${
                  selectedPaymentMethod === 'transfer'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  selectedPaymentMethod === 'transfer'
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === 'transfer' && (
                    <View className="w-2 h-2 rounded-full bg-white m-0.5" />
                  )}
                </View>
                <Text className="text-[16px] font-medium">Bank Transfer</Text>
              </Pressable>
            </View>
          </View>

          <View className="absolute bottom-12 w-full self-center">
            <CustomButton
              label={`Continue with ${selectedPaymentMethod === 'card' ? 'Card' : selectedPaymentMethod === 'ussd' ? 'USSD' : 'Bank Transfer'}`}
              // onPress={() => {
              //   replace('/order-success');
              // }}
              onPress={handlePayment}
              loading={loading || isPending || verifyIsPending}
              disabled={loading || isPending || verifyIsPending}
            />
          </View>
        </Container.Box>
      </ScrollView>

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

      {/* Address Selection Modal */}
      <LocationModal
        onAddressSaved={handleAddressSaved}
        initialAddress={currentAddress || ''}
        onDismiss={() => setShowAddressModal(false)}
        dismiss={() => setShowAddressModal(false)}
        refetch={refetch}
      />
    </Container.Page>
  );
}

export default Checkout;
