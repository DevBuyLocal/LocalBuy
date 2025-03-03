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

  const { data: trackOrderData } = useTrackOrder({ variables: { orderId } });
  const { data: singleOrderData } = useGetSingleOrder({
    variables: { orderId },
  });

  const labels = [
    `Order Placed `,
    `Order Processing`,
    `Ready to Ship`,
    `Out for delivery`,
    `Delivered`,
  ];
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
          <View className="h-[350px]">
            <StepIndicator
              // @ts-ignore
              customStyles={customStyles}
              currentPosition={1}
              labels={labels}
              stepCount={5}
              direction="vertical"
              renderStepIndicator={({ position, stepStatus }) => {
                if (position === 0) {
                  return (
                    <MaterialCommunityIcons
                      name="shopping-outline"
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
                return <></>;
              }}
            />
          </View>
        </Container.Box>
      </Container.Box>
    </Container.Page>
  );
}
