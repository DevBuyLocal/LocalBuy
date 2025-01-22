// Import  global CSS file
import '../../global.css';
import 'react-native-get-random-values';

import { useFonts } from '@expo-google-fonts/dm-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';

import Providers from '@/components/providers';
import { hydrateAuth, loadSelectedTheme } from '@/lib';
// import { v4 as uuidv4 } from 'uuid';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(main)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// configureReanimatedLogger({
//   level: ReanimatedLogLevel.warn,
//   strict: false, // Reanimated runs in strict mode by default
// });
export default function RootLayout() {
  // const theme = useThemeConfig();
  // const { colorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    'dm-sans-regular': require('../../assets/fonts/DMSans-Regular.ttf'),
    'dm-sans-medium': require('../../assets/fonts/DMSans-Medium.ttf'),
    'dm-sans-bold': require('../../assets/fonts/DMSans-Bold.ttf'),
  });
  if (!loaded && !error) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
