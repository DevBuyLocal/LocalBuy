import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Text, View } from '@/components/ui';
import { shortenAddress } from '@/lib/shorten-address';

function Verify() {
  const { email } = useLocalSearchParams();
  // const { push } = useRouter();

  return (
    <Container.Page showHeader headerTitle="OTP verification">
      <InputView>
        <Text className="mt-5 w-full text-[25px] font-bold">
          Verify your email address
        </Text>
        <Text className="mb-3 mt-2 w-4/5 text-[14px] opacity-75">
          We’ve sent a verification code to the email {shortenAddress(email)}.
          Please enter the code below to verify.
        </Text>
        <CustomInput
          placeholder="Verification code"
          keyboardType="number-pad"
          maxLength={6}
          containerClass="mt-5 mb-2"
        />
        <CountdownTimer countFrom={60} onCountdownComplete={() => {}} />
        <View className="absolute bottom-[120px] w-full">
          <CustomButton label="Continue" onPress={() => {}} />
        </View>
      </InputView>
    </Container.Page>
  );
}

export default Verify;
