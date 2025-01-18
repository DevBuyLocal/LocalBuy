import React from 'react';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ScrollView, Text, View } from '@/components/ui';

function Referrals() {
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

          <View className=" my-5 flex-row justify-between rounded-[10px] border border-[#12121233] px-5 py-3">
            <View>
              <Text className="mb-4 text-[12px] opacity-60">Referral code</Text>
              <Text className="text-[16px] font-bold">BYLO778</Text>
            </View>
            <CustomButton
              label="Copy"
              containerClassname="py-1 rounded-full h-[30px] px-5"
              textClassName="text-[10px]"
            />
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
