import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { FocusAwareStatusBar, SafeAreaView } from '@/components/ui';
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
      <LoaderProvider>
        <FocusAwareStatusBar />
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <APIProvider>
              <BottomSheetModalProvider>
                <SafeAreaView edges={pN === '/' ? [] : ['top']} />
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
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </LoaderProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
