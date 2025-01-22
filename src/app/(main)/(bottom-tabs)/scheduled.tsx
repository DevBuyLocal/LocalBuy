import { FlatList } from 'react-native';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import OrderItem from '@/components/order/order-item';
import { Text, View } from '@/components/ui';

export default function Scheduled() {
  return (
    <Container.Page showHeader hideBackButton headerTitle="Scheduled Orders">
      <Container.Box>
        <CustomInput isSearch placeholder="Search order..." />
        <Text className="mb-2 mt-4 text-[16px]">
          Below is a list of your scheduled orders. Click an order to edit or
          swipe left to delete
        </Text>

        <FlatList
          data={Array.from({ length: 10 })}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderItem item={item} handleDelete={() => {}} />
          )}
          ListFooterComponent={<View className="mb-60" />}
        />
      </Container.Box>
    </Container.Page>
  );
}
