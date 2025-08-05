import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Modal, Pressable } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useGetUser } from '@/api';
import { useGetSingleOrder } from '@/api/order/use-get-single-order';
import { useInitializePayment } from '@/api/order/use-initialize-payment';
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<
    'payNow' | 'payOnDelivery'
  >('payNow');
  const [showDeliveryFeePopup, setShowDeliveryFeePopup] = React.useState(false);
  // const [deliveryFeeApplied, setDeliveryFeeApplied] = React.useState(false);
  const [isPartialPayment, setIsPartialPayment] = React.useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = React.useState(false);
  const [showCalculatingModal, setShowCalculatingModal] = React.useState(false);

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

  // Debug logging
  // console.log('🔍 Checkout Debug:', {
  //   orderId,
  //   orderIdType: typeof orderId,
  //   passedPrice: price,
  //   passedPriceType: typeof price,
  //   orderData: order,
  //   orderTotalPrice: order?.order?.totalPrice,
  //   finalPrice: order?.order?.totalPrice || price,
  // });

  // Use order total price if available, otherwise use passed price
  const calculatedTotal = order?.order?.totalPrice || 0;
  // order?.order?.items?.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // ) || 0;

  // Split payment calculation for Pay on Delivery
  const isSplitPayment = selectedPaymentMethod === 'payOnDelivery';
  const deliveryFee = order?.order?.shipping?.totalShippingFee || 1000; // Fixed delivery fee
  console.log('🚀 ~ Checkout ~ deliveryFee:', order?.order);

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
  const amountToPayNow = isSplitPayment ? deliveryFee : calculatedTotal;
  // const remainingOnDelivery = isSplitPayment ? productPrice : 0;

  // Additional debug for price comparison
  // console.log('💰 Checkout Price Debug:', {
  //   orderTotalPrice: order?.order?.totalPrice,
  //   passedPrice: price,
  //   passedProductPrice,
  //   calculatedTotal,
  //   displayPrice,
  //   isSplitPayment,
  //   productPrice,
  //   totalOrderValue,
  //   amountToPayNow,
  //   remainingOnDelivery,
  //   orderItems: order?.order?.items?.length || 0,
  //   orderItemsDetails:
  //     order?.order?.items?.map((item) => ({
  //       productName: item.product?.name,
  //       quantity: item.quantity,
  //       price: item.price,
  //       total: item.price * item.quantity,
  //     })) || [],
  //   priceSource:
  //     calculatedTotal > 0
  //       ? 'calculated from items'
  //       : 'order total or passed price',
  // });

  // Get the current address to display
  const currentAddress = React.useMemo(() => {
    if (selectedAddress) {
      return selectedAddress;
    }

    // Prioritize default address, then profile address
    const defaultAddress = user?.defaultAddress?.addressLine1;
    const profileAddress =
      user?.type === 'individual' ? user?.profile?.address : user?.phoneNumber;

    return defaultAddress || profileAddress || '';
  }, [
    selectedAddress,
    user?.defaultAddress?.addressLine1,
    user?.type,
    user?.profile?.address,
    user?.phoneNumber,
  ]);

  // Debug user data
  // console.log('🔍 Checkout User Debug:', {
  //   userType: user?.type,
  //   userProfile: user?.profile,
  //   individualAddress: user?.profile?.address,
  //   businessAddress: user?.profile?.businessAddress,
  //   defaultAddress: user?.defaultAddress,
  //   currentAddress,
  //   selectedAddress,
  // });

  // Debug modal state
  // console.log('🔍 Checkout Modal State:', {
  //   showAddressModal,
  //   selectedAddress,
  //   currentAddress,
  // });

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

  const { mutate, isPending } = useInitializePayment({
    onSuccess: (data: any) => {
      setCheckoutUri(data?.data?.authorizationUrl);
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

    if (!selectedPaymentMethod) {
      setError('Please select a payment method and proceed with delivery fee');
      return;
    }

    // console.log('💳 Payment method selected:', selectedPaymentMethod);

    setLoading(true);
    mutate({
      orderId: Number(orderId),
      email: user?.email || '',
      amount: Number(amountToPayNow),
      paymentMethod: ['bank', 'card', 'ussd', 'bank_transfer'],
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
        contentContainerClassName="pb-40"
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
                  +234{' '}
                  {user?.type === 'individual'
                    ? user?.profile?.deliveryPhone
                    : user?.phoneNumber}
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
          <View className="mb-2 mt-4">
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
              <View className="mt-2 rounded-lg border border-gray-200 bg-white">
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
      <View className="absolute bottom-12 w-[90%] self-center">
        <CustomButton
          label="Continue"
          onPress={handlePayment}
          loading={loading || isPending || verifyIsPending}
          disabled={
            loading || isPending || verifyIsPending || !selectedPaymentMethod
          }
        />
      </View>

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
    </Container.Page>
  );
}

export default Checkout;
