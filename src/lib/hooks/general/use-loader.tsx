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
import { showMessage } from 'react-native-flash-message';

import { extractError } from '@/components/ui';

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
