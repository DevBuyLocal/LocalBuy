import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { useResendCode, useVerify } from '@/api';
import { Button, Text, View } from '@/components/ui';

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const verify = useVerify();
  const resendCode = useResendCode();

  const handleVerify = () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    verify.mutate(
      { email, code },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Email verified successfully!', [
            { text: 'OK', onPress: () => router.replace('/(auth)/login') },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            'Verification Failed',
            error?.response?.data?.message || 'Invalid verification code'
          );
        },
      }
    );
  };

  const handleResendCode = () => {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    resendCode.mutate(
      { email },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Verification code sent!');
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Failed to send verification code'
          );
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center px-4">
      <Text className="mb-4 text-center text-2xl font-bold">
        Verify Your Email
      </Text>

      <Text className="mb-8 text-center text-gray-600">
        Enter the 6-digit code sent to {email}
      </Text>

      <View className="mb-6">
        <Text className="mb-2 text-sm font-medium">Verification Code</Text>
        <View className="rounded-lg border border-gray-300 p-4">
          <Text
            className="text-center font-mono text-2xl tracking-widest"
            onPress={() => {
              // Simple text input simulation - in real app you'd use TextInput
              Alert.prompt(
                'Enter Code',
                'Enter the 6-digit verification code',
                (text) => setCode(text || ''),
                'plain-text',
                code
              );
            }}
          >
            {code || 'Tap to enter code'}
          </Text>
        </View>
      </View>

      <Button
        label={verify.isPending ? 'Verifying...' : 'Verify Email'}
        onPress={handleVerify}
        disabled={verify.isPending || code.length !== 6}
        className="mb-4"
      />

      <Button
        label={resendCode.isPending ? 'Sending...' : 'Resend Code'}
        variant="ghost"
        onPress={handleResendCode}
        disabled={resendCode.isPending}
      />

      <Button
        label="Back to Login"
        variant="ghost"
        onPress={() => router.push('/(auth)/login')}
        className="mt-4"
      />
    </View>
  );
}
