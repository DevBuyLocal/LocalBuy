import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Alert } from 'react-native';

import { useSavePreference } from '@/api';
import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import { Switch } from '@/components/ui';
import { useUtility } from '@/lib/utility';

/* PREFERENCES AND SETTINGS COMPONENT - MANAGES USER APP PREFERENCES */
function PreferenceSettings() {
  const notificationsEnabled = useUtility.use.notificationsEnabled();
  const setNotificationsEnabled = useUtility.use.setNotificationsEnabled();

  const { mutateAsync: savePreference, isPending } = useSavePreference({
    onSuccess: (data) => {
      console.log('✅ Notification preference saved successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to save notification preference:', error);
      // Revert the local state on error
      setNotificationsEnabled(!notificationsEnabled);
      Alert.alert(
        'Error',
        'Failed to save notification preference. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const handleNotificationToggle = async (newValue: boolean) => {
    console.log('🔔 Notification toggle changed:', { from: notificationsEnabled, to: newValue });
    
    // Update local state immediately for better UX
    setNotificationsEnabled(newValue);

    try {
      // Save to server
      await savePreference({
        preference: newValue ? ['notifications_enabled'] : ['notifications_disabled']
      });
      console.log('📤 Notification preference sent to server');
    } catch (error) {
      console.error('🔥 Error saving notification preference:', error);
      // Error handling is done in the onError callback above
    }
  };

  return (
    <Container.Page showHeader headerTitle="Preference and settings">
      <Container.Box>
        <AccountItem
          label="Enable notifications"
          rightElement={
            <Switch
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
              accessibilityLabel={'Toggle notification'}
              disabled={isPending}
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
