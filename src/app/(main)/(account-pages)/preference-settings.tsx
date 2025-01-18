import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import { Switch } from '@/components/ui';

function PreferenceSettings() {
  return (
    <Container.Page showHeader headerTitle="Preference and settings">
      <Container.Box>
        <AccountItem
          label="Enable notifications"
          rightElement={
            <Switch
              onChange={() => {}}
              // checked
              accessibilityLabel={'Toggle notification'}
            />
          }
          icon={
            <Ionicons name="notifications-circle" size={32} color="black" />
          }
        />
        <AccountItem
          label="Language setting"
          icon={<FontAwesome name="language" size={24} color="black" />}
        />
      </Container.Box>
    </Container.Page>
  );
}

export default PreferenceSettings;
