import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useLocalSearchParams } from 'expo-router';
import StepIndicator from 'react-native-step-indicator';

import { useTrackOrder } from '@/api/order';
import { useGetSingleOrder } from '@/api/order/use-get-single-order';
import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';

export default function TrackOrder() {
  const { orderId }: { orderId: string } = useLocalSearchParams();

  const { data: singleOrderData, isLoading } = useGetSingleOrder({
    variables: { orderId },
  });

  // Determine the current step based on order status
  const getCurrentStep = () => {
    const orderStatus = singleOrderData?.order?.status;
    const isScheduled = singleOrderData?.order?.scheduledDate;
    
    // For scheduled orders, use 6 steps with "Awaiting Payment" as step 0
    if (isScheduled) {
      switch (orderStatus) {
        case 'PENDING':
          return 0; // Awaiting Payment
        case 'PLACED':
          return 1; // Order Placed
        case 'PROCESSING':
          return 2; // Order Processing
        case 'READY_TO_SHIP':
          return 3; // Ready to Ship
        case 'OUT_FOR_DELIVERY':
          return 4; // Out for delivery
        case 'DELIVERED':
          return 5; // Delivered
        default:
          return 0; // Default to Awaiting Payment for scheduled orders
      }
    }
    
    // For regular orders, use 5 steps
    switch (orderStatus) {
      case 'PENDING':
        return 0; // Order Placed
      case 'PROCESSING':
        return 1; // Order Processing
      case 'READY_TO_SHIP':
        return 2; // Ready to Ship
      case 'OUT_FOR_DELIVERY':
        return 3; // Out for delivery
      case 'DELIVERED':
        return 4; // Delivered
      default:
        return 0; // Default to Order Placed
    }
  };

  const currentStep = getCurrentStep();
  const isScheduled = singleOrderData?.order?.scheduledDate;
  
  const labels = [
    `Order Placed `,
    `Order Processing`,
    `Ready to Ship`,
    `Out for delivery`,
    `Delivered`,
  ];

  const scheduledLabels = [
    `Awaiting Payment`,
    `Order Placed`,
    `Order Processing`,
    `Ready to Ship`,
    `Out for delivery`,
    `Delivered`,
  ];
  
  const currentLabels = isScheduled ? scheduledLabels : labels;
  const stepCount = isScheduled ? 6 : 5;
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
          <Text className="text-[16px]font-semibold">Order#: {orderId}</Text>
          <View className="my-2 h-px w-full bg-[#12121214]" />

          <Text>
            {singleOrderData?.order?.items[0]?.selectedOption}
            {`\n `}
            {Boolean((singleOrderData?.order?.items?.length || 0) > 1) &&
              `+${(singleOrderData?.order?.items?.length || 0) - 1} item(s)`}
          </Text>

          <Text className="mt-2 font-bold">
            N{singleOrderData?.order?.totalPrice?.toLocaleString()}
          </Text>
        </Container.Box>
        <Container.Box containerClassName="bg-white p-5 rounded-lg">
          <Text className="text-[16px] font-bold">Track order</Text>
          <View className="mt-2 h-px w-full bg-[#12121214]" />
          
          {isLoading ? (
            <View className="h-[350px] items-center justify-center">
              <Text className="text-[16px]">Loading order details...</Text>
            </View>
          ) : (
            <>
              {/* Debug info */}
              <View className="h-[350px]">
                <StepIndicator
                  // @ts-ignore
                  customStyles={customStyles}
                  currentPosition={currentStep}
                  labels={currentLabels}
                  stepCount={stepCount}
                  direction="vertical"
                  renderStepIndicator={({ position, stepStatus }) => {
                    if (position === 0) {
                      return (
                        <MaterialCommunityIcons
                          name={isScheduled ? "clock-outline" : "shopping-outline"}
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }
                    if (position === 1) {
                      return (
                        <SimpleLineIcons
                          name="basket-loaded"
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }

                    if (position === 2) {
                      return (
                        <MaterialCommunityIcons
                          name="cart-check"
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }
                    if (position === 3) {
                      return (
                        <MaterialCommunityIcons
                          name="golf-cart"
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }
                    if (position === 4) {
                      return (
                        <MaterialCommunityIcons
                          name="truck-delivery"
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }
                    if (position === 5) {
                      return (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={stepStatus === 'current' ? '#0F3D30' : '#fff'}
                        />
                      );
                    }
                    return <></>;
                  }}
                />
              </View>
            </>
          )}
        </Container.Box>
      </Container.Box>
    </Container.Page>
  );
}
