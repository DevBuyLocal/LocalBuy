import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View, Pressable } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

interface VerificationBannerProps {
  email: string;
}

export default function VerificationBanner({ email }: VerificationBannerProps) {
  const { push } = useRouter();

  const handleVerifyNow = () => {
    push(`/verify?email=${encodeURIComponent(email)}`);
  };

  const handleResendCode = () => {
    Alert.alert(
      'Resend Verification Code',
      'A new verification code will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resend', onPress: () => push(`/verify?email=${encodeURIComponent(email)}`) }
      ]
    );
  };

  return (
    <View className="bg-orange-50 border border-orange-200 p-4 mx-4 rounded-lg mb-4">
      <View className="flex-row items-start gap-3">
        <Ionicons name="warning" size={20} color="#f97316" />
        <View className="flex-1">
          <Text className="text-[14px] font-semibold text-orange-800 mb-1">
            Email Verification Required
          </Text>
          <Text className="text-[12px] text-orange-700 mb-3">
            Please verify your email address to access all features. Check your inbox for the verification code.
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleVerifyNow}
              className="bg-orange-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-[12px] font-medium text-white">
                Verify Now
              </Text>
            </Pressable>
            <Pressable
              onPress={handleResendCode}
              className="border border-orange-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-[12px] font-medium text-orange-600">
                Resend Code
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
} 