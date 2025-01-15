import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';

const supportItems = [
  {
    label: 'Frequently asked questions',
    icon: <Feather name="help-circle" size={24} color="black" />,
    onPress: () => {},
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

function Support() {
  return (
    <Container.Page showHeader headerTitle="Support & help">
      <Container.Box>
        {supportItems.map((e, i) => (
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
