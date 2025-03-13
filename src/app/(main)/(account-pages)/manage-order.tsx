import { useRouter } from 'expo-router';
import { View } from 'moti';
import React, { useState } from 'react';
import { FlatList, Pressable } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useGetAllOrders } from '@/api/order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import Empty from '@/components/general/empty';
import OrderItem from '@/components/order/order-item';
import { Text } from '@/components/ui';

const tabs = [{ label: 'Past orders' }, { label: 'Upcoming orders' }];

/* ORDER MANAGEMENT COMPONENT - HANDLES ORDER SEARCH AND DISPLAY */
function ManageOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const { push } = useRouter();
  const { data } = useGetAllOrders();
  const orders = React.useMemo(() => data?.orders || [], [data]);
  const filteredOrders = orders
    .filter((e) =>
      tabIndex === 1 ? e.status === 'PENDING' : e.status === 'PROCESSING'
    )
    .filter((order) =>
      order?.items?.some((item) =>
        item?.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <Container.Page headerTitle="Manage Orders" showHeader>
      <Container.Box containerClassName="pb-3">
        <CustomInput
          placeholder="Search by item"
          value={searchQuery}
          isSearch
          onChangeText={setSearchQuery}
        />
      </Container.Box>
      <Container.Box className="w-full flex-row bg-[#F7F7F7]">
        {tabs.map((tab, i) => (
          <Pressable
            key={i.toString()}
            onPress={() => setTabIndex(i)}
            className={twMerge(
              'w-1/2 items-center justify-center py-3 border-b-[2px]',
              i === tabIndex ? 'border-b-primaryText' : 'border-b-[#1212121a]'
            )}
          >
            <Text>{tab.label}</Text>
          </Pressable>
        ))}
      </Container.Box>

      <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
        <FlatList
          data={filteredOrders}
          keyExtractor={(_, i) => i.toString()}
          initialNumToRender={10}
          renderItem={({ item }) => <OrderItem item={item} isHistory />}
          ListFooterComponent={<View className="mb-20" />}
          showsVerticalScrollIndicator={false}
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

export default ManageOrder;
