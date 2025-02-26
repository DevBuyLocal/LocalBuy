import { useLocalSearchParams } from 'expo-router';

import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';

export default function TrackOrder() {
  const { orderId }: { orderId: string } = useLocalSearchParams();
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
        </Container.Box>
        <Container.Box containerClassName="bg-white p-5 rounded-lg">
          <Text className="text-[16px]font-semibold">Track order</Text>
          <View className="my-2 h-px w-full bg-[#12121214]" />
        </Container.Box>
      </Container.Box>
    </Container.Page>
  );
}
