import { View } from 'moti';
import React, {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import Container from '@/components/general/container';
import { colors, extractError, Text } from '@/components/ui';

interface LoaderContextProps {
  loading: boolean;
  loadingText?: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setShowPage: Dispatch<SetStateAction<boolean>>;
  showPage: boolean;
  setLoadingText: Dispatch<SetStateAction<string>>;
  setError: (error: unknown) => void;
  setSuccess: (message: string) => void;
}

const LoaderContext = createContext<LoaderContextProps | null>(null);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<unknown>(null);
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPage, setShowPage] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>('');

  useEffect(() => {
    if (success) {
      showMessage({ message: success, type: 'success' });
      setSuccess('');
    }
    if (error) {
      showMessage({ message: extractError(error), type: 'danger' });
      setError(null);
    }
  }, [error, success]);

  const contextValue = useMemo(
    () => ({
      loading,
      setLoading,
      loadingText,
      setLoadingText,
      setError,
      setSuccess,
      showPage,
      setShowPage,
    }),
    [loading, loadingText, showPage]
  );

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {loading && showPage && (
        <Container.Page
          containerClassName="items-center justify-center bg-[#12121299] dark:bg-[#28282880] px-0 flex-0"
          style={StyleSheet.absoluteFillObject}
        >
          <View className="items-center rounded-[16px] bg-white px-8 py-4 dark:bg-[#282828]">
            <ActivityIndicator
              animating
              size="large"
              color={colors.primaryText}
              style={{ transform: [{ scale: 1.5 }], padding: 5 }}
            />
            <Text className="mt-2 text-[16px] font-semibold text-black">
              {loadingText || 'Loading'}
            </Text>
          </View>
        </Container.Page>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = ({
  showLoadingPage = true,
}: {
  showLoadingPage?: boolean;
}): LoaderContextProps => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  // Immediately set showPage on the first render
  useEffect(() => {
    context.setShowPage(showLoadingPage);
  }, []); // Empty dependency array ensures it runs only once

  // useEffect(() => {
  //   context.setShowPage(showLoadingPage);
  //   return () => {
  //     context.setShowPage(true);
  //   };
  // }, [context, showLoadingPage]);

  return context;
};
