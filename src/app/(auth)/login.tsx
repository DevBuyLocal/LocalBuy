import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { queryClient, QueryKey, useLogin } from '@/api';
import Container from '@/components/general/container';
import ControlledCustomInput from '@/components/general/controlled-custom-input';
import CustomButton from '@/components/general/custom-button';
import CustomCheckbox from '@/components/general/custom-checkbox';
import { Modal, Pressable, Radio, Text, useModal, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { UserType, userType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';

import { type LoginFormType, loginSchema } from './types';

export default function Login() {
  const { replace, push, canGoBack, back } = useRouter();
  const { from } = useLocalSearchParams();
  const { ref, present, dismiss } = useModal();
  const [selectedRole, setSelectedRole] = React.useState<UserType>(
    UserType.Individual
  );
  const { mutate } = useLogin();
  const { signIn } = useAuth();
  const { loading, setLoading, setError, setSuccess, setLoadingText } =
    useLoader({ showLoadingPage: true });
  const { handleSubmit, control } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleLogin(data: LoginFormType) {
    setLoading(true);
    setLoadingText('Logging in...');
    mutate(
      {
        email: data.email.toLowerCase(),
        password: data.password,
      },
      {
        async onSuccess(data) {
          signIn({ access: data?.user?.token, refresh: '' });
          await queryClient.fetchQuery({
            queryKey: [QueryKey.USER, QueryKey.CART],
          });
          //TODO: FETCH USER DATA AND STORE IT IN CONTEXT
          setSuccess('Login successful');
          replace(from === 'cart' ? '/(tabs)/cart' : `/`);
        },
        onError(error) {
          setError(error?.response?.data);
        },
        onSettled() {
          setLoading(false);
          setLoadingText('loading');
        },
      }
    );
  }
  return (
    <Container.Page
      showHeader
      headerTitle="Log in"
      backPress={() => {
        if (canGoBack()) {
          back();
        } else {
          replace('/');
        }
      }}
    >
      <Container.Box>
        <Text className="mt-5 w-4/5 text-[25px] font-bold">Welcome back</Text>
        <Text className="mt-2 text-[16px] opacity-75">
          Login to resume your shopping experience
        </Text>
        <ControlledCustomInput<LoginFormType>
          placeholder="Email address"
          containerClass="mt-[18px]"
          keyboardType="email-address"
          control={control}
          name="email"
        />
        <ControlledCustomInput<LoginFormType>
          placeholder="Password"
          isPassword
          containerClass="mb-2"
          control={control}
          name="password"
        />
        <View className="mb-4 self-end">
          <Pressable onPress={() => push('/reset-password')} className="pb-2">
            <Text className="color-primaryText">Forgot password?</Text>
          </Pressable>
        </View>
        <CustomCheckbox
          label={'Keep me signed in'}
          description="By checking this box you won’t have to sign in as often on this device. For your security, we recommend only checking this box on personal devices."
        />
      </Container.Box>
      <Container.Box containerClassName="absolute bottom-16 w-full self-center">
        <CustomButton
          loading={loading}
          label="Continue"
          onPress={handleSubmit(handleLogin)}
        />
        <Pressable className="mt-2 flex-row self-center" onPress={present}>
          <Text className="color-[#121212BF]">Don't have an account? </Text>
          <Text className="color-primaryText">Sign up</Text>
        </Pressable>
      </Container.Box>
      <Modal ref={ref} title="Are you an individual or a business owner?">
        <View className="mt-2 px-5">
          {userType.map((e, i) => (
            <View key={i.toString()} className="py-5">
              <Radio.Root
                checked={e.value === selectedRole}
                onChange={() => setSelectedRole(e.value as UserType)}
                accessibilityLabel="radio button"
                className="justify-between  pb-2"
              >
                <Radio.Label text={e.name} className="text-[16px]" />
                <Radio.Icon checked={selectedRole === e.value} />
              </Radio.Root>
              {/* DIVIDER LINE BETWEEN RADIO OPTIONS */}
              {i === 0 && <View className="top-4 h-px bg-[#1212121A]" />}
            </View>
          ))}
          <CustomButton
            label={'Continue'}
            onPress={() => {
              replace(`/sign-up?role=${selectedRole}`);
              dismiss();
            }}
          />
        </View>
      </Modal>
    </Container.Page>
  );
}
