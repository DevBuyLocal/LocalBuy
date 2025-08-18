/* eslint-disable max-lines-per-function */
import { Env } from '@env';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import StepIndicator from 'react-native-step-indicator';

import { useTrackOrder } from '@/api/order';
import { useGetAllOrders } from '@/api/order/use-get-all-order';
import { useGetSingleOrder } from '@/api/order/use-get-single-order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import FeedbackPopup from '@/components/feedback/feedback-popup';
import { Image, Text, View } from '@/components/ui';

export default function TrackOrder() {
  const {
    orderId,
    price,
    paymentMethod,
  }: { orderId: string; price?: string; paymentMethod?: string } =
    useLocalSearchParams();
  const { push } = useRouter();
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);

  const {
    data: singleOrderData,
    isLoading,
    error,
  } = useGetSingleOrder(Number(orderId))();

  // Live tracking from backend
  const { data: trackData, isLoading: trackingLoading, error: trackingError } = useTrackOrder({ variables: { orderId: Number(orderId) } });
  // console.log('🚀 ~ TrackOrder ~ singleOrderData:', singleOrderData);

  // Fallback: Try to get order from all orders list
  const { data: allOrdersData } = useGetAllOrders();
  const fallbackOrder = React.useMemo(() => {
    if (!singleOrderData?.order && allOrdersData?.orders) {
      return allOrdersData.orders.find((order) => order.id === Number(orderId));
    }
    return null;
  }, [singleOrderData?.order, allOrdersData?.orders, orderId]);

  // Use fallback order if single order API fails
  const orderData = singleOrderData?.order || fallbackOrder;

  // Split payment detection and calculation
  const isSplitPayment =
    paymentMethod === 'payOnDelivery' ||
    ((orderData as any)?.transactions?.length === 1 &&
      (orderData as any).transactions[0].amount === 1000);
  const deliveryFee = 1000;
  const productPrice = isSplitPayment
    ? orderData?.totalPrice || 0
    : price
      ? Number(price)
      : orderData?.totalPrice || 0;
  const totalOrderValue = isSplitPayment
    ? productPrice + deliveryFee
    : price
      ? Number(price)
      : orderData?.totalPrice || 0;
  const paidAmount = isSplitPayment ? deliveryFee : totalOrderValue;
  const remainingAmount = isSplitPayment ? productPrice : 0;

  // Determine the current step based on backend tracking status (4 steps)
  const getCurrentStep = () => {
    const backendStatus = (trackData?.order?.status || orderData?.status || 'PENDING') as string;
    const status = backendStatus.toUpperCase();
    switch (status) {
      case 'PENDING':
      case 'PLACED':
      case 'ORDER_PLACED':
        return 0; // Order Placed
      case 'PROCESSING':
        return 1; // Processing
      case 'READY_TO_SHIP':
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 2; // Shipped
      case 'DELIVERED':
        return 3; // Delivered
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep();

  const currentLabels = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Delivered',
  ];
  const stepCount = 4;

  // Debug logging for track order
  // console.log('🔍 Track Order Debug:', {
  //   orderId,
  //   orderIdType: typeof orderId,
  //   orderIdNumber: Number(orderId),
  //   price,
  //   priceType: typeof price,
  //   priceNumber: price ? Number(price) : null,
  //   isLoading,
  //   error: error?.message,
  //   errorResponse: error?.response?.data,
  //   orderStatus,
  //   isScheduled,
  //   currentStep,
  //   stepCount,
  //   totalPrice: orderData?.totalPrice,
  //   displayPrice: price ? Number(price) : orderData?.totalPrice,
  //   itemsCount: orderData?.items?.length,
  //   scheduledDate: orderData?.scheduledDate,
  //   orderData: orderData,
  //   scheduledDateRaw: orderData?.scheduledDate,
  //   scheduledDateType: typeof orderData?.scheduledDate,
  //   hasScheduledDate: !!orderData?.scheduledDate,
  //   fullResponse: singleOrderData,
  //   fallbackOrder: fallbackOrder,
  //   allOrdersCount: allOrdersData?.orders?.length,
  //   responseKeys: singleOrderData ? Object.keys(singleOrderData) : 'no data',
  // });
  const customStyles = {
    stepIndicatorSize: 40,
    currentStepIndicatorSize: 50,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#0F3D30',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#0F3D30',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#0F3D30',
    labelAlign: 'flex-start',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#0F3D30',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#0F3D30',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#0F3D30',
  };

  return (
    <Container.Page
      showHeader
      headerTitle="Track order"
      containerClassName="bg-[#F7F7F7]"
    >
      <Container.Box>
        <Container.Box containerClassName="bg-white p-5 rounded-lg">
          <Text className="text-[16px] font-semibold">Order#: {orderId}</Text>
          <View className="my-2 h-px w-full bg-[#12121214]" />

          {/* Order Details Section */}
          <View className="mb-4">
            <Text className="mb-2 text-[14px] font-medium text-gray-600">
              Order Details
            </Text>

            {/* Optional pending payment note */}
            {((trackData?.order?.status || orderData?.status) === 'PENDING') && (
              <View className="mb-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <Text className="text-[14px] font-semibold text-orange-700">⏳ Awaiting Payment</Text>
                <Text className="mt-1 text-[12px] text-orange-600">Please complete payment to proceed with your order</Text>
              </View>
            )}

            {/* Product Details */}
            <View className="space-y-3">
              {orderData?.items?.map((item: any, index: number) => {
                const img = (item?.productOption?.image?.[0] || item?.product?.image?.[0]) as string | undefined;
                const absolute = img && /^https?:\/\//i.test(img) ? img : (img ? `${Env.API_URL?.replace(/\/$/, '')}${img.startsWith('/') ? img : `/${img}`}` : undefined);
                return (
                  <View key={index} className="flex-row items-center space-x-3">
                    <Image
                      source={
                        absolute
                          ? { uri: absolute }
                          : require('../../../assets/images/img-p-holder.png')
                      }
                      className="size-12 rounded-lg"
                      contentFit="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-[14px] font-medium" numberOfLines={2}>
                        {item?.product?.name || 'Product'}
                      </Text>
                      <Text className="text-[12px] text-gray-500">
                        {item?.selectedOption} • Qty: {item?.quantity}
                      </Text>
                    </View>
                    <Text className="text-[14px] font-semibold">
                      N{(item?.price * item?.quantity)?.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Total Price */}
            <View className="mt-4 border-t border-gray-200 pt-3">
              {isSplitPayment ? (
                // Split Payment Breakdown
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-[16px] font-semibold">
                      Total Order Value
                    </Text>
                    <Text className="text-[18px] font-bold text-green-600">
                      N{totalOrderValue?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between py-1">
                    <Text className="text-[14px] text-gray-600">
                      Paid (Delivery Fee)
                    </Text>
                    <Text className="text-[14px] font-medium text-green-600">
                      N{paidAmount?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between py-1">
                    <Text className="text-[14px] text-gray-600">
                      Remaining Balance
                    </Text>
                    <Text className="text-[14px] font-medium text-orange-600">
                      N{remainingAmount?.toLocaleString()}
                    </Text>
                  </View>
                  <View className="mt-2 border-t border-gray-100 pt-2">
                    <Text className="text-[12px] font-medium text-orange-600">
                      Status: Awaiting Full Payment
                    </Text>
                  </View>
                </>
              ) : (
                // Regular Payment Display
                <View className="flex-row items-center justify-between">
                  <Text className="text-[16px] font-semibold">
                    Total Amount
                  </Text>
                  <Text className="text-[18px] font-bold text-green-600">
                    N
                    {(price
                      ? Number(price)
                      : orderData?.totalPrice
                    )?.toLocaleString()}
                  </Text>
                </View>
              )}

              {/* Scheduled Date for Scheduled Orders */}
            </View>
          </View>
        </Container.Box>
        <Container.Box containerClassName="bg-white p-5 rounded-lg">
          <Text className="text-[16px] font-bold">Track order</Text>
          <View className="mt-2 h-px w-full bg-[#12121214]" />

          {isLoading ? (
            <View className="h-[350px] items-center justify-center">
              <Text className="text-[16px]">Loading order details...</Text>
            </View>
          ) : error ? (
            <View className="h-[350px] items-center justify-center">
              <Text className="text-[16px] text-red-600">
                Error loading order details
              </Text>
              <Text className="mt-2 text-[12px] text-gray-500">
                Order ID: {orderId}
              </Text>
            </View>
          ) : !orderData ? (
            <View className="h-[350px] items-center justify-center">
              <Text className="text-[16px] text-gray-600">Order not found</Text>
              <Text className="mt-2 text-[12px] text-gray-500">
                Order ID: {orderId}
              </Text>
              <Text className="mt-1 text-[12px] text-gray-500">
                Available orders: {allOrdersData?.orders?.length || 0}
              </Text>
            </View>
          ) : (
            <>

              {/* Step Indicator */}
              <View className="h-[350px]">
                <StepIndicator
                  // @ts-ignore
                  customStyles={customStyles}
                  currentPosition={currentStep}
                  labels={currentLabels}
                  stepCount={stepCount}
                  direction="vertical"
                  renderLabel={({ position, stepStatus }) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginLeft: 12,
                        minHeight: 50,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 13,
                          lineHeight: 16,
                          color: stepStatus === 'current' ? '#0F3D30' : '#999999',
                        }}
                      >
                        {currentLabels[position]}
                      </Text>
                    </View>
                  )}
                  renderStepIndicator={({ position, stepStatus }) => {
                    switch (position) {
                      case 0:
                        return (
                          <MaterialCommunityIcons
                            name="shopping-outline"
                            size={24}
                            color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                          />
                        );
                      case 1:
                        return (
                          <SimpleLineIcons
                            name="basket-loaded"
                            size={24}
                            color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                          />
                        );
                      case 2:
                        return (
                          <MaterialCommunityIcons
                            name="truck-delivery"
                            size={24}
                            color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                          />
                        );
                      case 3:
                        return (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                          />
                        );
                      default:
                        return <></>;
                    }
                  }}
                />
              </View>
            </>
          )}

          {/* Feedback Button for Delivered Orders */}
          {orderData?.status === 'DELIVERED' && (
            <View className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <View className="mb-3 items-center">
                <Text className="text-lg font-semibold text-green-800 dark:text-green-200">
                  🎉 Order Delivered!
                </Text>
                <Text className="mt-1 text-center text-sm text-green-700 dark:text-green-300">
                  How was your experience with this order?
                </Text>
              </View>
              <CustomButton
                label="Share Your Feedback"
                onPress={() => setShowFeedbackPopup(true)}
                containerClassname="bg-green-600 border-green-600"
              />
            </View>
          )}
        </Container.Box>

        {/* Feedback Popup */}
        <FeedbackPopup
          visible={showFeedbackPopup}
          onClose={() => setShowFeedbackPopup(false)}
          orderNumber={orderId}
        />
      </Container.Box>
    </Container.Page>
  );
}
