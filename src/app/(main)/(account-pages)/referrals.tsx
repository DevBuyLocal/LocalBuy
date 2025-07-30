import React from 'react';
import { Alert } from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import { useGetUser } from '@/api';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ScrollView, Text, View } from '@/components/ui';

/* REFERRALS COMPONENT - HANDLES REFERRAL CODE GENERATION AND REDEMPTION */
function Referrals() {
  const { data: userData, isLoading, error } = useGetUser();

  const handleCopyReferralCode = () => {
    if (userData?.referralCode) {
      Alert.alert('Referral Code', `Your referral code is: ${userData.referralCode}`);
    }
  };

  const handleShareReferralCode = () => {
    if (userData?.referralCode) {
      // You can implement sharing functionality here
      Alert.alert('Share', 'Sharing functionality can be implemented here');
    }
  };

  return (
    <Container.Page showHeader headerTitle="Referrals">
      <AvoidSoftInputView>
        <ScrollView
          className="h-full px-5"
          contentContainerClassName="flex-1 h-full"
        >
          <Text className="mt-5 text-[16px] font-medium">Invite Friends</Text>
          <Text className="my-2 text-[14px] color-[#030C0ABF]">
            For every friend who joins and places their first order, you'll get
            2 free deliveries. Copy and share the code and start earning rewards
            now!
          </Text>

          {error && (
            <View className="my-4 rounded-lg bg-red-50 p-4">
              <Text className="text-red-600">
                Failed to load referral data. Please try again.
              </Text>
            </View>
          )}

          <View className="my-5 flex-row justify-between rounded-[10px] border border-[#12121233] px-5 py-3">
            <View>
              <Text className="mb-4 text-[12px] opacity-60">Referral code</Text>
              <Text className="text-[16px] font-bold">
                {isLoading ? 'Loading...' : userData?.referralCode || 'No referral code'}
              </Text>
            </View>
            <View className="flex-row space-x-2">
            <CustomButton
              label="Copy"
                containerClassname="py-1 rounded-full h-[30px] px-3"
                textClassName="text-[10px]"
                onPress={handleCopyReferralCode}
                disabled={!userData?.referralCode}
              />
              <CustomButton
                label="Share"
                containerClassname="py-1 rounded-full h-[30px] px-3 bg-blue-500"
              textClassName="text-[10px]"
                onPress={handleShareReferralCode}
                disabled={!userData?.referralCode}
            />
            </View>
          </View>

          <View className="my-8 h-px bg-[#12121220]" />
          <Text className="my-2 text-[18px] font-bold">
            Were you referred by someone? Please enter their referral code below
          </Text>
          <CustomInput placeholder="Referral code" />
          <View className="absolute bottom-[120px] w-full">
            <CustomButton label="Apply code" />
            <CustomButton.Secondary label="Dismiss" />
          </View>
        </ScrollView>
      </AvoidSoftInputView>
    </Container.Page>
  );
}

export default Referrals;
