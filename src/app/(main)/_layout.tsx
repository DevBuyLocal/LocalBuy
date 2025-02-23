/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { queryClient, QueryKey, useGetUser } from '@/api';
import { useGetCartItems } from '@/api/cart';
import { useAuth, useIsFirstTime } from '@/lib';

export default function MainLayout() {
  const { status, token } = useAuth();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useGetUser();
  useGetCartItems();

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
        if (token) {
          queryClient.fetchQuery({ queryKey: [QueryKey.USER] });
          queryClient.fetchQuery({ queryKey: [QueryKey.CART] });
        }
      }, 1000);
    }
  }, [hideSplash, status, token]);

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
      <Stack.Screen name="schedule-order" options={{ headerShown: false }} />
      <Stack.Screen
        name="complete-profile"
        options={{ headerShown: false, presentation: 'containedModal' }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="add-product"
        options={{ headerShown: false, presentation: 'containedModal' }}
      />
      <Stack.Screen name="style" options={{ headerShown: false }} />
    </Stack>
  );
}
