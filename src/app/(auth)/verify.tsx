import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { useVerify } from '@/api';
import { useResendCode } from '@/api/auth/use-resend-code';
import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Text, View, Pressable } from '@/components/ui';
import { Env } from '@/lib/env';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { shortenAddress } from '@/lib/shorten-address';
import { accessToken } from '@/lib/auth';

function Verify() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = React.useState<string>('');
  const [codeResent, setCodeResent] = React.useState(false);
  const { replace } = useRouter();
  const { mutate } = useVerify();
  const { mutate: ResendCode } = useResendCode();
  const { setSuccess, setLoading, setError, loading } = useLoader({
    showLoadingPage: false,
  });

  const handleSubmit = () => {
    if (!email || !code) return;
    setLoading(true);
    mutate(
      {
        code,
        email: decodeURIComponent(email as string),
      },
      {
        onSuccess() {
          setSuccess('Verification successful');
          // Check if user is already logged in (has token)
          const token = accessToken();
          if (token?.access) {
            // User is already logged in, redirect to main app
            replace('/');
          } else {
            // User needs to login, redirect to login
            replace('/login');
          }
        },
        onError(error) {
          setError(error?.response?.data);
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  };

  function Resend() {
    setCodeResent(true);
    ResendCode(
      {
        email: decodeURIComponent(email as string),
      },
      {
        onSuccess() {
          setSuccess('Code resent successfully');
        },
        onError(error) {
          console.log('🚀 ~ file: verify.tsx:38 ~ error:', error);
          setError(error?.response?.data);
        },
        onSettled() {
          setLoading(false);
        },
      }
    );
  }

  return (
    <Container.Page showHeader headerTitle="OTP verification">
      <InputView>
        <Text className="mt-5 w-full text-[25px] font-bold">
          Verify your email address
        </Text>
        <Text className="mb-3 mt-2 w-4/5 text-[14px] opacity-75">
          We've sent a verification code to the email {shortenAddress(email)}.
          Please enter the code below to verify.
        </Text>
        <CustomInput
          placeholder="Verification code"
          keyboardType="number-pad"
          maxLength={6}
          containerClass="mt-5 mb-2"
          value={code}
          onChangeText={setCode}
        />
        
        {codeResent ? (
          <CountdownTimer
            countFrom={60}
            onCountdownComplete={() => {}}
            resend={Resend}
            text1="Not getting code?"
            text2="Resend"
            initialText="Resend"
          />
        ) : (
          <Pressable onPress={Resend} className="flex-row items-center">
            <Text className="text-[14px] font-medium opacity-70">
              Not getting code?{' '}
            </Text>
            <Text className="text-[14px] font-medium color-primaryText">
              Resend
            </Text>
          </Pressable>
        )}
        
        <View className="absolute bottom-[120px] w-full">
          <CustomButton
            label="Continue"
            disabled={!code}
            loading={loading}
            onPress={handleSubmit}
          />
        </View>
      </InputView>
    </Container.Page>
  );
}

export default Verify;
