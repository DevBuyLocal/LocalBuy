import { useRouter } from 'expo-router';
import React from 'react';

import { useResetPassword } from '@/api/auth/use-reset-password';
import { useUpdatePassword } from '@/api/auth/use-update-password';
import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { Pressable,Text } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

export default function ResetPassword() {
  const [email, setEmail] = React.useState('');
  const { setSuccess, setLoading, setError } = useLoader({
    showLoadingPage: false,
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { back } = useRouter();
  const [pass, setPass] = React.useState({
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);

  const { mutate } = useResetPassword({
    onSuccess: (data) => {
      setSuccess(data?.message);
      setCodeSent(true);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });

  const { mutate: mutateUpdate } = useUpdatePassword({
    onSuccess: (data) => {
      setSuccess(data?.message);
      setPass({ password: '', confirmPassword: '' });
      setCode('');
      back();
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });
  function SendCode() {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    mutate({
      email,
    });
  }
  function UpdatePassword() {
    if (!email) return;
    setLoading(true);
    mutateUpdate({
      email: email,
      code,
      password: pass?.password,
      confirmPassword: pass?.confirmPassword,
    });
  }

  return (
    <Container.Page showHeader headerTitle="Reset Password">
      <Container.Box>
        <Text className="mt-5 w-4/5 text-[25px] font-bold">
          Forgot Password?
        </Text>
        <Text className="mt-2 text-[16px] opacity-75">
          We will send a verification code to this email to confirm it's you
        </Text>
        <CustomInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
        />
        
        {codeSent ? (
          <CountdownTimer
            countFrom={60}
            onCountdownComplete={() => {}}
            resend={SendCode}
            text1="Click to receive code"
            text2="Resend"
            initialText="Send"
            disabled={!email || !emailRegex.test(email)}
            invalidMsg="Please provide a valid email"
          />
        ) : (
          <Pressable onPress={SendCode} className="flex-row items-center">
            <Text className="text-[14px] font-medium opacity-70">
              Click to receive code{' '}
            </Text>
            <Text className="text-[14px] font-medium color-primaryText">
              Send
            </Text>
          </Pressable>
        )}

        {codeSent && (
          <>
            <CustomInput
              placeholder="Enter new password"
              isPassword
              value={pass?.password}
              onChangeText={(e) => {
                setPass({ ...pass, password: e });
              }}
            />
            <CustomInput
              placeholder="Confirm new password"
              isPassword
              value={pass?.confirmPassword}
              onChangeText={(e) => {
                setPass({ ...pass, confirmPassword: e });
              }}
            />
            <CustomInput
              placeholder="Code"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          </>
        )}
      </Container.Box>
      <Container.Box containerClassName="absolute bottom-16 w-full self-center">
        <CustomButton
          label="Continue"
          onPress={UpdatePassword}
          disabled={code.length < 6 || pass.password !== pass.confirmPassword}
        />
      </Container.Box>
    </Container.Page>
  );
}
