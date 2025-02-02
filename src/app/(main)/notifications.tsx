import NewsIcon from 'assets/notification/news-icon';
import OrderIcon from 'assets/notification/order-icon';
import SystemIcon from 'assets/notification/system-icon';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { FlatList } from 'react-native';

import Container from '@/components/general/container';
import Empty from '@/components/general/empty';
import { Text, View } from '@/components/ui';

const dummyNotifi = [
  {
    icon: OrderIcon,
    desc: 'Order #764332 has been completed & arrived at the destination address.',
    type: 'Order',
    title: 'Order arrived',
    createdAt: '2024-01-15T10:30:00.000Z',
  },
  {
    icon: OrderIcon,
    desc: 'Order #444022 has been successfully placed. Please wait for the product to be sent',
    type: 'Order',
    title: 'Order Success',
    createdAt: '2024-01-14T15:45:00.000Z',
  },
  {
    icon: NewsIcon,
    desc: `Get 20% off on all groceries. Use code GROCERY20's to avail the discount.`,
    type: 'News',
    title: '20% Discount on Grocery',
    createdAt: '2024-01-13T08:20:00.000Z',
  },
  {
    icon: SystemIcon,
    desc: 'Your payment and shipping address has been updated successfully.',
    type: 'System',
    title: 'Address Updated',
    createdAt: '2024-01-12T16:55:00.000Z',
  },
];

function Notifications() {
  const NotificationItem = ({ item }: any) => {
    const date = format(parseISO(item?.createdAt), 'MMM dd, yyyy • hh:mm a');
    return (
      <View className="mt-5 flex-row gap-3 border-b border-[#00000020] pb-5">
        <item.icon />
        <View className="w-[85%]">
          <Text className="text-[16px] font-semibold">{item?.title}</Text>
          <Text className="my-1 text-[12px] opacity-60">{date}</Text>
          <Text className="mt-2 text-[13px] font-light">{item?.desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <Container.Page showHeader headerTitle="Notifications">
      <Container.Box>
        <FlatList
          data={dummyNotifi || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View>
              <Empty
                image={require('../../../assets/images/empty-noti.png')}
                desc="You don’t have any notification messages. Your notification would appear here when you do."
                containerClassName="mt-40"
              />
            </View>
          }
        />
      </Container.Box>
    </Container.Page>
  );
}

export default Notifications;
