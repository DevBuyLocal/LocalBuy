import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import Container from '@/components/general/container';
import { Text } from '@/components/ui';

import AccountInfo from './account-info';
import Legal from './legal';
import ManageOrder from './manage-order';
import PreferenceSettings from './preference-settings';
import Referrals from './referrals';
import Support from './support';

function MainAccountPage() {
  const { page } = useLocalSearchParams();

  function Pages() {
    switch (page) {
      case 'account-information':
        return <AccountInfo />;
      case 'manage-order':
        return <ManageOrder />;
      case 'settings':
        return <PreferenceSettings />;
      case 'support':
        return <Support />;
      case 'legal':
        return <Legal />;
      case 'referrals':
        return <Referrals />;
      default:
        return <Text>No matching page</Text>;
    }
  }

  return (
    <Container.Page
      // showHeader
      headerTitle={(page as string).replaceAll('-', ' ')}
    >
      {Pages()}
    </Container.Page>
  );
}

export default MainAccountPage;
