import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { Platform } from 'react-native';

import { useGetCartItems } from '@/api/cart';
import { useGetAllOrders } from '@/api/order';
import { Text, View } from '@/components/ui';
import { Inventory } from '@/components/ui/icons/inventory';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { UserType } from '@/lib/constants';

// eslint-disable-next-line max-lines-per-function
export default function TabsLayout() {
  const { data } = useGetCartItems();
  const { total } = useCart(CartSelector);
  const { token, user } = useAuth();
  const { push } = useRouter();

  const noInCart = token ? data?.items?.length : total;

  const { data: orderData } = useGetAllOrders();
  const orders = React.useMemo(
    () => orderData?.orders?.filter((e) => e?.status === 'PENDING') || [],
    [orderData]
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Fontisto name="home" size={26} color={color} />
          ),
          tabBarLabel(props) {
            return (
              <View className="flex items-center">
                <Text
                  className={`text-[12px] ${
                    props.focused ? 'text-primaryText' : 'text-[#12121266]'
                  }`}
                >
                  Home
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialIcons name="shopping-cart" size={28} color={color} />
              <AnimatePresence>
                {Number(noInCart) > 0 && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{ type: 'timing', duration: 350 }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 px-[5px]"
                  >
                    <Text className=" text-[14px] font-bold text-white">
                      {noInCart}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
          ),
          tabBarLabel(props) {
            return (
              <View className="flex items-center">
                <Text
                  className={`text-[12px] ${
                    props.focused ? 'text-primaryText' : 'text-[#12121266]'
                  }`}
                >
                  Cart
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="scheduled"
        options={{
          title: 'Scheduled',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
          tabBarLabel(props) {
            return (
              <View className="flex items-center">
                <Text
                  className={`text-[12px] ${
                    props.focused ? 'text-primaryText' : 'text-[#12121266]'
                  }`}
                >
                  Scheduled
                </Text>
              </View>
            );
          },
        }}
        listeners={{
          tabPress: (e) => {
            if (!token?.access) {
              push('/login');
              e.preventDefault();
            }
          },
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Inventory color={color} />,
          tabBarLabel(props) {
            return (
              <View className="flex items-center">
                <Text
                  className={`text-[12px] ${
                    props.focused ? 'text-primaryText' : 'text-[#12121266]'
                  }`}
                >
                  Inventory
                </Text>
              </View>
            );
          },
          href: user?.type === UserType.Business ? undefined : null,
          lazy: true,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <View>
              <MaterialIcons name="account-circle" size={28} color={color} />
              <AnimatePresence>
                {Number(orders.length) > 0 && Number(noInCart) < 1 && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{ type: 'timing', duration: 350 }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 px-[5px]"
                  >
                    <Text className=" text-[14px] font-bold text-white">
                      {orders.length}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
          ),
          tabBarLabel(props) {
            return (
              <View className="flex items-center">
                <Text
                  className={`text-[12px] ${
                    props.focused ? 'text-primaryText' : 'text-[#12121266]'
                  }`}
                >
                  Account
                </Text>
              </View>
            );
          },
        }}
        listeners={{
          tabPress: (e) => {
            if (!token?.access) {
              push('/login');
              e.preventDefault();
            }
          },
        }}
      />
    </Tabs>
  );
}
