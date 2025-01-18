/* eslint-disable react/no-unstable-nested-components */
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  // if (status === 'signOut') {
  //   return <Redirect href="/login" />;
  // }
  // return <AuthScreen />;

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="verify" options={{ headerShown: false }} />
    </Stack>
  );
}
