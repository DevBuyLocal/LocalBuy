import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

// Removed StepIndicator import - using custom implementation
// import { useTrackOrder } from '@/api/order'; // Removed unused import
import { useGetSingleOrder } from '@/api/order/use-get-single-order';
import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';

export default function TrackOrder() {
  const { orderId }: { orderId: string } = useLocalSearchParams();

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
            <View className="flex-col space-y-4">
              {labels.map((label, index) => (
                <View key={index} className="flex-row items-center space-x-3">
                  <View
                    className={`size-[40px] items-center justify-center rounded-full ${
                      index <= 1 ? 'bg-[#0F3D30]' : 'bg-[#aaaaaa]'
                    }`}
                  >
                    {index === 0 && (
                      <MaterialCommunityIcons
                        name="shopping-outline"
                        size={24}
                        color={index <= 1 ? '#fff' : '#fff'}
                      />
                    )}
                    {index === 1 && (
                      <SimpleLineIcons
                        name="basket-loaded"
                        size={24}
                        color={index <= 1 ? '#fff' : '#fff'}
                      />
                    )}
                    {index === 2 && (
                      <MaterialCommunityIcons
                        name="cart-check"
                        size={24}
                        color={index <= 1 ? '#fff' : '#fff'}
                      />
                    )}
                    {index === 3 && (
                      <MaterialCommunityIcons
                        name="golf-cart"
                        size={24}
                        color={index <= 1 ? '#fff' : '#fff'}
                      />
                    )}
                    {index === 4 && (
                      <MaterialCommunityIcons
                        name="truck-delivery"
                        size={24}
                        color={index <= 1 ? '#fff' : '#fff'}
                      />
                    )}
                  </View>
                  <Text
                    className={`text-[13px] ${
                      index <= 1 ? 'text-[#0F3D30]' : 'text-[#999999]'
                    }`}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Container.Box>
      </Container.Box>
    </Container.Page>
  );
}
