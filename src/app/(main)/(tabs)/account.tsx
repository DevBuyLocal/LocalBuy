import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type Href, useRouter } from 'expo-router';
import { type NavigationOptions } from 'expo-router/build/global-state/routing';
import { AnimatePresence, MotiView } from 'moti';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Alert } from 'react-native';

import { useGetAllOrders } from '@/api/order';
import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';
import { signOut } from '@/lib';

const accountItems = (
  push: (href: Href, options?: NavigationOptions) => void,
  colorScheme?: 'dark' | 'light',
  indicator?: number,
  handleLogout?: () => void
) => [
  {
    label: 'Account Information',
    icon: (
      <MaterialIcons
        name="account-circle"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: () => push('/main-account-page?page=account-information'),
  },

  {
    label: 'Manage Order',
    icon: (
      <View>
        <FontAwesome5
          name="clipboard-list"
          size={24}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
        <AnimatePresence>
          {Number(indicator) > 0 && (
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
                {indicator}
              </Text>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    ),
    onPress: () => push('/main-account-page?page=manage-order'),
  },
  {
    label: 'Preference and settings',
    icon: (
      <Ionicons
        name="settings-sharp"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: () => push('/main-account-page?page=settings'),
  },
  {
    label: 'Support & help',
    icon: (
      <AntDesign
        name="questioncircle"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: () => push('/main-account-page?page=support'),
  },
  {
    label: 'Legal & policy information',
    icon: (
      <FontAwesome
        name="legal"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: () => push('/main-account-page?page=legal'),
  },
  {
    label: 'Referrals',
    icon: (
      <MaterialCommunityIcons
        name="account-group"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: () => push('/main-account-page?page=referrals'),
  },
  {
    label: 'Logout',
    icon: (
      <Ionicons
        name="exit"
        size={24}
        color={colorScheme === 'dark' ? '#fff' : 'black'}
      />
    ),
    onPress: handleLogout || (() => {}),
  },
];

export default function Account() {
  const { push } = useRouter();
  const { colorScheme } = useColorScheme();
  const [isLogoutConfirming, setIsLogoutConfirming] = React.useState(false);

  const { data: orderData } = useGetAllOrders();
  const orders = React.useMemo(
    () => orderData?.orders?.filter((e) => e?.status === 'PENDING') || [],
    [orderData]
  );

  const handleLogout = React.useCallback(() => {
    if (isLogoutConfirming) return; // Prevent multiple alerts
    
    setIsLogoutConfirming(true);
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: () => setIsLogoutConfirming(false),
      },
      {
        text: 'Logout',
        onPress: () => {
          signOut();
          push('/login');
          setIsLogoutConfirming(false);
        },
      },
    ]);
  }, [isLogoutConfirming, push]);

  const accountI = accountItems(push, colorScheme, orders.length || 0, handleLogout);

  return (
    <Container.Page headerTitle="Account" showHeader hideBackButton>
      <Container.Box>
        {accountI.map((e, i) => (
          <View key={i.toString()}>
            <AccountItem label={e.label} icon={e.icon} onPress={e.onPress} />
            {i === 2 && <View className="my-5 h-px bg-[#12121226]" />}
          </View>
        ))}
      </Container.Box>
    </Container.Page>
  );
}
