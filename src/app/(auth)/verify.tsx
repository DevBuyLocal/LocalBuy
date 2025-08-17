import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { useVerify } from '@/api';
import { useResendCode } from '@/api/auth/use-resend-code';
import { OTPEmailService } from '@/api/email/use-otp-email';
import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Pressable,Text, View } from '@/components/ui';
import { accessToken, signIn } from '@/lib/auth';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { shortenAddress } from '@/lib/shorten-address';

function Verify() {
  const { email, userType } = useLocalSearchParams();
  const [code, setCode] = React.useState<string>('');
  const [codeResent, setCodeResent] = React.useState(false);
  const { replace, push } = useRouter();
  const { mutate } = useVerify();
  const { mutate: ResendCode } = useResendCode();
  const { setSuccess, setLoading, setError, loading } = useLoader({
    showLoadingPage: false,
  });

  // Debug: Log the email parameter
  console.log('Email parameter:', email);
  console.log('User type parameter:', userType);

  const handleSubmit = () => {
    console.log('📍 Verification submit called with:', { email, code });
    if (!email || !code) return;
    setLoading(true);
    mutate(
      {
        code,
        email: decodeURIComponent(email as string),
      },
      {
        onSuccess(responseData) {
          console.log('📍 VERIFICATION SUCCESS HANDLER CALLED');
          setSuccess('Verification successful');
          console.log('📍 Verification successful, response:', responseData);
          console.log('📍 Verification token from data:', responseData?.data?.token);
          
          // Sign the user in with the token from verification
          if (responseData?.data?.token) {
            const tokenData = {
              access: responseData.data.token,
              refresh: responseData.data.token, // Use same token for refresh for now
            };
            console.log('📍 Signing in with token data:', tokenData);
            signIn(tokenData);
            console.log('📍 User signed in with verification token');
            
            // Wait a moment for the token to be set, then redirect
            setTimeout(() => {
              const currentToken = accessToken()?.access;
              console.log('📍 Current access token after sign in:', currentToken ? 'Present' : 'Missing');
              console.log('📍 Token value:', currentToken);
              console.log('📍 Redirecting to address page with params:', { email, userType });
              push(`/address?email=${email}&userType=${userType}`);
            }, 200); // Increased timeout to ensure token is set
          } else {
            console.log('📍 No token in verification response');
            console.log('📍 Response structure:', responseData);
            console.log('📍 Redirecting to address page without token');
            push(`/address?email=${email}&userType=${userType}`);
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
        async onSuccess(response) {
          setSuccess('Code resent successfully');
          
          // Send enhanced OTP email notification
          try {
            if (email && response?.response?.code) {
                             await OTPEmailService.sendVerificationOTP(
                 decodeURIComponent(email as string),
                 response.response.code,
                 'User', // userName not available here, using default
                 10 // 10 minutes expiration
               );
            }
          } catch (error) {
            console.log('Failed to send enhanced OTP email:', error);
          }
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
        <View className="flex-1 px-5">
          <Text className="mt-5 w-full text-[25px] font-bold">
            Verify your email address
          </Text>
          <Text className="mb-3 mt-2 w-4/5 text-[14px] opacity-75">
            We've sent a verification code to the email {email ? shortenAddress(email) : 'your email address'}.
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
          
          {/* Bottom section with button */}
          <View className="mt-auto pt-8">
            <CustomButton
              label="Continue"
              disabled={!code}
              loading={loading}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </InputView>
    </Container.Page>
  );
}

export default Verify;
