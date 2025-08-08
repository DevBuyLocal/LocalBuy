/* eslint-disable react/no-unstable-nested-components */
import { Redirect, Stack, usePathname } from 'expo-router';
import React from 'react';

import { useAuth } from '@/lib';

export default function AuthLayout() {
  const { status } = useAuth();
  const pathname = usePathname();

  if (status === 'signIn') {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
