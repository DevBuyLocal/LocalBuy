import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
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
  return (
    <GestureHandlerRootView
      style={styles.container}
      // className={undefined}
      className={theme.dark ? `dark` : undefined}
    >
      <FocusAwareStatusBar />
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              <LoaderProvider>
                <SafeAreaView edges={['top']} />
                <StatusBar
                  barStyle={
                    colorScheme === 'dark' ? 'dark-content' : 'light-content'
                  }
                  backgroundColor={'white'}
                />

                {children}
              </LoaderProvider>
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
