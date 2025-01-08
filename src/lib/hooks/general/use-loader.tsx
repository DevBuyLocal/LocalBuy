import { View } from 'moti';
import React, {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import Container from '@/components/general/container';
import { Text } from '@/components/ui';

interface LoaderContextProps {
  loading: boolean;
  loadingText?: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingText: Dispatch<SetStateAction<string>>;
  setError: Dispatch<string>;
  setSuccess: Dispatch<string>;
}

const LoaderContext = createContext<LoaderContextProps | null>(null);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');

  useEffect(() => {
    if (success) {
      showMessage({
        message: success,
        type: 'success',
      });
    }

    if (error) {
      showMessage({
        message: error,
        type: 'danger',
      });
    }

    return () => {
      setLoading(false);
      setLoadingText('');
      setError('');
      setSuccess('');
    };
  }, [error, success]);

  return (
    <LoaderContext.Provider
      value={{
        loading,
        setLoading,
        loadingText,
        setLoadingText,
        setError,
        setSuccess,
      }}
    >
      <>
        {children}

        {loading && (
          <Container.Page
            className="items-center justify-center bg-[#12121299] px-0"
            style={StyleSheet.absoluteFillObject}
          >
            <View className="items-center rounded-[16px] bg-white px-8 py-4">
              <ActivityIndicator
                animating
                size="large"
                className="color-primaryText scale-150 p-5"
              />
              <Text className="mt-2 text-[16px] font-semibold text-black">
                {loadingText || 'Loading'}
              </Text>
            </View>
          </Container.Page>
        )}
      </>
    </LoaderContext.Provider>
  );
};

export const useLoader = (): LoaderContextProps => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
