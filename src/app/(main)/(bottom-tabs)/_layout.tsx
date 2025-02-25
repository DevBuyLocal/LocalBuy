import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';

import { useGetCartItems } from '@/api/cart';
import { Text, View } from '@/components/ui';
import { Inventory } from '@/components/ui/icons/inventory';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { UserType } from '@/lib/constants';

// eslint-disable-next-line max-lines-per-function
export default function BottomTabsLayout() {
  const { data } = useGetCartItems();
  const { total } = useCart(CartSelector);
  const { token, user } = useAuth();
  const { push } = useRouter();

  const noInCart = token ? data?.items?.length : total;

  // React.useEffect(() => {
  //   console.log(token);

  //   if (token) {
  //     queryClient.fetchQuery({ queryKey: [QueryKey.USER] });
  //     refetch();
  //     console.log('got here 2');

  //     // queryClient.fetchQuery({ queryKey: [QueryKey.CART] });
  //   }
  // }, [refetch, token, user]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Fontisto name="home" size={26} color={color} />
          ),
          tabBarButtonTestID: 'feed-tab',
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
      {/* {user?.type === UserType.Business && ( */}
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
      {/* )} */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={28} color={color} />
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
