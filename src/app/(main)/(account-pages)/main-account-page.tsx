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

/* MAIN ACCOUNT PAGE COMPONENT - HANDLES ROUTING BETWEEN DIFFERENT ACCOUNT SECTIONS */
function MainAccountPage() {
  const { page } = useLocalSearchParams();

  /* PAGES ROUTER - RENDERS APPROPRIATE COMPONENT BASED ON URL PARAMETERS */
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
