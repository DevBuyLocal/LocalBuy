import { View } from 'moti';
import React, { useState } from 'react';
import { FlatList } from 'react-native';

import { useGetAllOrders } from '@/api/order';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import OrderItem from '@/components/order/order-item';

/* ORDER MANAGEMENT COMPONENT - HANDLES ORDER SEARCH AND DISPLAY */
function ManageOrder() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data } = useGetAllOrders();
  const orders = React.useMemo(() => data?.orders || [], [data]);
  console.log('🚀 ~ ManageOrder ~ orders:', orders);

  return (
    <Container.Page headerTitle="Manage Orders" showHeader>
      <Container.Box containerClassName="-pt-1">
        <CustomInput
          placeholder="Search by item"
          value={searchQuery}
          isSearch
          onChangeText={setSearchQuery}
        />
      </Container.Box>
      <Container.Box containerClassName="bg-[#F7F7F7] pb-40">
        <FlatList
          data={orders}
          keyExtractor={(_, i) => i.toString()}
          initialNumToRender={10}
          renderItem={({ item }) => <OrderItem item={item} isHistory />}
          ListFooterComponent={<View className="mb-20" />}
        />
      </Container.Box>
    </Container.Page>
  );
}

export default ManageOrder;
