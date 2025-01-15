import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type Href, useRouter } from 'expo-router';
import { type NavigationOptions } from 'expo-router/build/global-state/routing';
import React from 'react';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import { View } from '@/components/ui';
const accountItems = (
  push: (href: Href, options?: NavigationOptions) => void
) => [
  {
    label: 'Account Information',
    icon: <MaterialIcons name="account-circle" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=account-information'),
  },
  {
    label: 'Manage Order',
    icon: <FontAwesome5 name="clipboard-list" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=manage-order'),
  },
  {
    label: 'Preference and settings',
    icon: <Ionicons name="settings-sharp" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=settings'),
  },
  {
    label: 'Support & help',
    icon: <AntDesign name="questioncircle" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=support'),
  },
  {
    label: 'Legal & policy information',
    icon: <FontAwesome name="legal" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=legal'),
  },
  {
    label: 'Referrals',
    icon: (
      <MaterialCommunityIcons name="account-group" size={24} color="black" />
    ),
    onPress: () => push('/main-account-page?page=referrals'),
  },
  {
    label: 'Logout',
    icon: <Ionicons name="exit" size={24} color="black" />,
    onPress: () => {},
  },
];

export default function Account() {
  const { push } = useRouter();
  const accountI = accountItems(push);

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
