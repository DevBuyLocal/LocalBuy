/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { useAuth, useIsFirstTime } from '@/lib';

export default function MainLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  // if (status === 'signOut') {
  //   return <Redirect href="/login" />;
  // }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(bottom-tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="all-products" options={{ headerShown: false }} />
      <Stack.Screen name="all-brands" options={{ headerShown: false }} />
      <Stack.Screen
        name="(account-pages)/main-account-page"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="walkthrough" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen
        name="search"
        options={{ headerShown: false, presentation: 'containedModal' }}
      />
      <Stack.Screen name="style" options={{ headerShown: false }} />
    </Stack>
  );
}
