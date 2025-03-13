import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { twMerge } from 'tailwind-merge';

import { APIProvider } from '@/api';
import { SafeAreaView } from '@/components/ui';
import { LoaderProvider } from '@/lib/hooks/general/use-loader';
import { useThemeConfig } from '@/lib/use-theme-config';

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  const { colorScheme } = useColorScheme();
  const pN = usePathname();

  return (
    <GestureHandlerRootView
      style={styles.container}
      // className={undefined}
      className={theme.dark ? `dark` : undefined}
    >
      <ThemeProvider value={theme}>
        <APIProvider>
          <LoaderProvider>
            <BottomSheetModalProvider>
              <SafeAreaView
                className={twMerge(
                  'flex-1 bg-[#0f3d30]',
                  pN !== '/' && 'bg-transparent'
                )}
                edges={['top']}
                // edges={pN === '/' ? [] : ['top']}
              >
                {/* <FocusAwareStatusBar /> */}

                {/* <SafeAreaView edges={pN === '/' ? [] : ['top']} /> */}
                <StatusBar
                  barStyle={
                    pN === '/'
                      ? 'light-content'
                      : colorScheme === 'dark'
                        ? 'light-content'
                        : 'dark-content'
                  }
                  backgroundColor={
                    pN === '/'
                      ? '#0F3D30'
                      : colorScheme === 'dark'
                        ? 'black'
                        : 'white'
                  }
                  translucent={false}
                />

                {children}
              </SafeAreaView>
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </LoaderProvider>
        </APIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
