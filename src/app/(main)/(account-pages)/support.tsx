import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';

/* SUPPORT ITEMS LIST - CONTAINS ALL SUPPORT AND HELP OPTIONS */
const supportItems = (push: (href: any) => void) => [
  {
    label: 'Frequently asked questions',
    icon: <Feather name="help-circle" size={24} color="black" />,
    onPress: () => push('/main-account-page?page=faq'),
  },
  {
    label: 'Contact support',
    icon: <MaterialIcons name="support-agent" size={24} color="black" />,
    onPress: () => {},
  },
  {
    label: 'Report a problem',
    icon: <MaterialIcons name="report" size={24} color="black" />,
    onPress: () => {},
  },
];

/* SUPPORT COMPONENT - DISPLAYS FAQ, CONTACT SUPPORT AND PROBLEM REPORTING OPTIONS */
function Support() {
  const { push } = useRouter();
  const items = supportItems(push);

  return (
    <Container.Page showHeader headerTitle="Support & help">
      <Container.Box>
        {items.map((e, i) => (
          <AccountItem
            key={i.toString()}
            label={e.label}
            icon={e.icon}
            onPress={e.onPress}
          />
        ))}
      </Container.Box>
    </Container.Page>
  );
}

export default Support;
