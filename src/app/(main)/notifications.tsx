import Container from '@/components/general/container';
import { Text } from '@/components/ui';

import React from 'react';

function Notifications() {
  return (
    <Container.Page showHeader headerTitle="Notifications">
      <Container.Box>
        <Text>Notifications</Text>
      </Container.Box>
    </Container.Page>
  );
}

export default Notifications;
