import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

import { useRegister } from '@/api';
import { Button, ControlledInput, Text, View } from '@/components/ui';
import { UserType } from '@/lib/constants';

import { type RegFormType, regSchema } from './types';

export default function SignUp() {
  const register = useRegister();

  const { handleSubmit, control } = useForm<RegFormType>({
    resolver: zodResolver(regSchema),
  });

  const onSubmit: SubmitHandler<RegFormType> = (data) => {
    register.mutate(
      {
        email: data.email.toLowerCase(),
        password: data.password,
        type: UserType.Individual,
        referal_code: data.refer,
      },
      {
        onSuccess: (response) => {
          if (response?.response?.email) {
            router.push({
              pathname: '/(auth)/verify',
              params: { email: response.response.email },
            });
          }
        },
        onError: (error: any) => {
          Alert.alert(
            'Registration Failed',
            error?.response?.data?.message ||
              'An error occurred during registration'
          );
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center px-4">
      <Text className="mb-8 text-center text-2xl font-bold">
        Create Account
      </Text>

      <ControlledInput
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <ControlledInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
      />

      <ControlledInput
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry
      />

      <ControlledInput
        control={control}
        name="refer"
        label="Referral Code (Optional)"
        placeholder="Enter referral code"
      />

      <Button
        label={register.isPending ? 'Creating Account...' : 'Create Account'}
        onPress={handleSubmit(onSubmit)}
        disabled={register.isPending}
        className="mt-6"
      />

      <Button
        label="Already have an account? Sign In"
        variant="ghost"
        onPress={() => router.push('/(auth)/login')}
        className="mt-4"
      />
    </View>
  );
}
