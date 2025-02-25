import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

import { useGetAllOrders } from '@/api/order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import Empty from '@/components/general/empty';
import OrderItem from '@/components/order/order-item';
import { Text, View } from '@/components/ui';

export default function Scheduled() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data } = useGetAllOrders();
  const { push } = useRouter();
  const orders = React.useMemo(() => data?.orders || [], [data]);
  const filteredOrders = orders
    .filter((e) => e.scheduledDate)
    .filter((order) =>
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  return (
    <Container.Page showHeader hideBackButton headerTitle="Scheduled Orders">
      <Container.Box containerClassName="mt-3">
        <CustomInput
          isSearch
          placeholder="Search scheduled order..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text className="mb-2 mt-4 text-[14px]">
          Below is a list of your scheduled orders. Click an order to edit or
          swipe left to delete
        </Text>

        <FlatList
          data={filteredOrders}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderItem item={item} handleDelete={() => {}} />
          )}
          ListFooterComponent={<View className="mb-60" />}
          ListEmptyComponent={
            <View className="mt-10 h-full flex-1">
              <Empty desc="No orders found in history. Start shopping to see your orders here." />
              <CustomButton
                label="Start Shopping"
                onPress={() => push(`/all-products?type=trending`)}
              />
            </View>
          }
        />
      </Container.Box>
    </Container.Page>
  );
}
