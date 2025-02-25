import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';

/* LEGAL ITEMS LIST - CONTAINS ALL LEGAL AND POLICY RELATED OPTIONS */
const legalItems = [
  {
    label: 'Terms & condition',
    icon: <MaterialIcons name="privacy-tip" size={24} color="black" />,
    onPress: () => {},
  },
  {
    label: 'Privacy policy',
    icon: <MaterialIcons name="document-scanner" size={24} color="black" />,
    onPress: () => {},
  },
  {
    label: 'About us',
    icon: <AntDesign name="infocirlce" size={24} color="black" />,
    onPress: () => {},
  },
];

/* LEGAL COMPONENT - DISPLAYS TERMS, PRIVACY AND ABOUT US SECTIONS */
function Legal() {
  return (
    <Container.Page showHeader headerTitle="Support & help">
      <Container.Box>
        {legalItems.map((e, i) => (
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

export default Legal;
