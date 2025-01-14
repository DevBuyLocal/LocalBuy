import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';

import { Text, View } from '@/components/ui';
import { Inventory } from '@/components/ui/icons/inventory';
import { CartSelector, useCart } from '@/lib/cart';

export default function BottomTabsLayout() {
  const { total } = useCart(CartSelector);
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Fontisto name="home" size={26} color={color} />
          ),
          tabBarButtonTestID: 'feed-tab',
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
                {Boolean(total) && (
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
                      {total}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scheduled"
        options={{
          title: 'Scheduled',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Inventory color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
