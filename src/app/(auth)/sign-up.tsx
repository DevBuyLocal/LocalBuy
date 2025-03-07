import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useRegister } from '@/api';
import Container from '@/components/general/container';
import ControlledCustomInput from '@/components/general/controlled-custom-input';
import CustomButton from '@/components/general/custom-button';
import InputView from '@/components/general/input-view';
import { Pressable, Text, View } from '@/components/ui';
import { type UserType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';

import { type RegFormType, regSchema } from './types';

export default function SignUp() {
  const { role }: { role: UserType } = useLocalSearchParams();
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: true,
  });
  const { push, replace, canGoBack, back } = useRouter();
  const { mutate: Register } = useRegister();
  const {
    handleSubmit,
    control,
    // formState: { isValid },
  } = useForm<RegFormType>({
    resolver: zodResolver(regSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      refer: undefined,
    },
  });
  const onSubmit = (data: RegFormType) => {
    setLoading(true);
    Register(
      {
        email: data.email.toLowerCase(),
        password: data.password,
        type: role,
        referal_code: data.refer,
      },
      {
        onSuccess(data) {
          setSuccess('Account Created Successfully ');
          push(
            `/verify?token=${data?.response?.token}&email=${encodeURIComponent(data?.response?.email)}`
          );
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
  return (
    <Container.Page
      showHeader
      headerTitle="Create an account"
      backPress={() => {
        if (canGoBack()) {
          back();
        } else {
          replace('/');
        }
      }}
    >
      <InputView>
        <Text className="w-4/5 text-[25px] font-bold">
          Let’s get you signed up and shopping.
        </Text>
        <Text className="mt-2  text-[16px] opacity-75">
          Enter your email to get started
        </Text>
        <ControlledCustomInput<RegFormType>
          name="email"
          placeholder={
            role === 'individual' ? 'Email address' : 'Business email'
          }
          containerClass="mt-10"
          keyboardType="email-address"
          control={control}
        />
        <ControlledCustomInput<RegFormType>
          name="password"
          isPassword
          placeholder="Password"
          control={control}
        />
        <AnimatePresence>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <ControlledCustomInput<RegFormType>
              name="confirmPassword"
              isPassword
              placeholder="Confirm password"
              description="Must contain at least 6 characters, include uppercase, lowercase letters, and a number."
              control={control}
            />
            <ControlledCustomInput<RegFormType>
              name="refer"
              placeholder="Referral code (optional)"
              containerClass="mt-5"
              control={control}
            />
          </MotiView>
        </AnimatePresence>
        <View className="absolute bottom-[140px] w-full self-center">
          <CustomButton
            label="Create account"
            onPress={handleSubmit(onSubmit)}
            // disabled={!isValid}
            loading={loading}
          />
          <Pressable
            className="mt-2 flex-row self-center"
            onPress={() => replace('/login')}
          >
            <Text className="color-[#121212BF]">Already have an account? </Text>
            <Text className="color-primaryText">Login</Text>
          </Pressable>
        </View>
      </InputView>
    </Container.Page>
  );
}
