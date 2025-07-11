import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView } from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import { useLogin } from '@/api';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { ControlledInput, Text, View } from '@/components/ui';
import { setUser, useAuth } from '@/lib';

import { type LoginFormType, loginSchema } from './types';

export default function Login() {
  const { signIn } = useAuth();
  const login = useLogin();

  const { handleSubmit, control } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    console.log('🚀 ~ Login ~ Form data submitted:', data);
    login.mutate(data, {
      onSuccess: (data) => {
        if (data?.user?.token) {
          signIn({ access: data.user.token, refresh: data.user.token });
          setUser(data.user as any);
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Alert.alert(
          'Login Failed',
          error?.response?.data?.message || 'An error occurred during login'
        );
      },
    });
  };

  return (
    <Container.Page>
      <AvoidSoftInputView>
        <ScrollView
          className="h-full px-5"
          contentContainerClassName="flex-1 h-full"
        >
          <View className="flex-1 justify-center">
            {/* Welcome Section */}
            <View className="mb-8">
              <Text className="text-center text-[28px] font-bold text-[#121212]">
                Welcome Back
              </Text>
              <Text className="mt-2 text-center text-[16px] text-[#667085]">
                Sign in to continue shopping for bulk food items
              </Text>
            </View>

            {/* Referral Bonus Section */}
            <View className="mb-6 rounded-[12px] border border-[#FED7AA] bg-[#FFF7ED] p-4">
              <Text className="mb-2 text-center text-[16px] font-bold text-[#EA580C]">
                🎉 Referral Bonus Available!
              </Text>
              <Text className="text-center text-[14px] text-[#9A3412]">
                Invite friends and get 2 free deliveries for each friend who
                places their first order
              </Text>
              <CustomButton
                label="Learn More"
                containerClassname="mt-3 bg-[#EA580C] rounded-full h-[32px]"
                textClassName="text-[12px] text-white"
                onPress={() =>
                  router.push(
                    '/(main)/(account-pages)/main-account-page?page=referrals'
                  )
                }
              />
            </View>

            {/* Login Form */}
            <View className="mb-6">
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
                name="referralCode"
                label="Referral Code (Optional)"
                placeholder="Enter referral code if you have one"
              />

              <Text className="mt-1 px-1 text-[12px] text-[#667085]">
                💡 Have a referral code? Enter it to unlock special rewards!
              </Text>
            </View>

            {/* Login Button */}
            <CustomButton
              label={login.isPending ? 'Signing In...' : 'Sign In'}
              onPress={handleSubmit(onSubmit)}
              disabled={login.isPending}
              containerClassname="mb-4"
            />

            {/* Secondary Actions */}
            <View className="items-center space-y-3">
              <CustomButton.Secondary
                label="Forgot Password?"
                onPress={() => router.push('/(auth)/reset-password')}
                containerClassname="mb-2"
              />

              <View className="flex-row items-center">
                <Text className="text-[14px] text-[#667085]">
                  Don't have an account?
                </Text>
                <Text
                  className="ml-1 text-[14px] font-medium text-[#0F3D30] underline"
                  onPress={() => router.push('/(auth)/sign-up')}
                >
                  Sign Up
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </AvoidSoftInputView>
    </Container.Page>
  );
}
