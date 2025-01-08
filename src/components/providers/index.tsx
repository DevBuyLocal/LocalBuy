import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { FocusAwareStatusBar, SafeAreaView } from '@/components/ui';
import { LoaderProvider } from '@/lib/hooks/general/use-loader';
import { useThemeConfig } from '@/lib/use-theme-config';

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <FocusAwareStatusBar />
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              <LoaderProvider>
                <SafeAreaView edges={['top']} />
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
