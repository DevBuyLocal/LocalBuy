import Fontisto from '@expo/vector-icons/Fontisto';
import NewsIcon from 'assets/notification/news-icon';
import OrderIcon from 'assets/notification/order-icon';
import SystemIcon from 'assets/notification/system-icon';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { FlatList, Pressable } from 'react-native';

import {
  type TNotification,
  useGetNotifications,
} from '@/api/notifications/use-get-notifications';
import { useReadNotification } from '@/api/notifications/use-read-notification';
import Container from '@/components/general/container';
import Empty from '@/components/general/empty';
import { Text, View } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

function Notifications() {
  const { data: notifications, refetch } = useGetNotifications()();

  const { setError, setLoading } = useLoader({
    showLoadingPage: false,
  });

  const { mutateAsync } = useReadNotification({
    onSuccess: async () => {
      await refetch();
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const NotificationItem = ({ item }: { item: TNotification }) => {
    const date = format(parseISO(item?.createdAt), 'MMM dd, yyyy • hh:mm a');
    return (
      <Pressable
        className="mt-5 flex-row gap-3 border-b border-[#00000020] pb-5"
        onPress={() => {
          if (item?.isRead) return;
          mutateAsync({ notificationId: item.id });
        }}
      >
        <View>
          {item?.type === 'Order' && <OrderIcon />}
          {item?.type === 'News' && <NewsIcon />}
          {item?.type === 'System' && <SystemIcon />}
          {!item?.type && <SystemIcon />}
        </View>
        <View className="w-[85%]">
          <Text className="text-[16px] font-semibold">{item?.title}</Text>
          <Text className="my-1 text-[12px] opacity-60">{date}</Text>
          <Text className="mt-2 w-[95%] text-[13px] font-light">
            {item?.message}
          </Text>
          {!item.isRead && (
            <Text className="absolute right-5 top-0 text-lg text-red-500">
              ●
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <Container.Page
      showHeader
      headerTitle="Notifications"
      rightHeaderIcon={
        (notifications?.data || []).filter((e) => !e.isRead).length > 0 ? (
          <Pressable
            className="absolute right-5 top-6"
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
            onPress={async () => {
              if (!notifications?.data.length) return;
              await Promise.allSettled(
                notifications.data.map(async (e) => {
                  return mutateAsync({ notificationId: e.id });
                })
              ).then(() => {
                refetch();
              });
            }}
          >
            <Fontisto name="checkbox-active" size={18} color="black" />
          </Pressable>
        ) : undefined
      }
    >
      <Container.Box>
        <FlatList
          data={notifications?.data || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerClassName="pb-40"
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
