import React from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { Text } from '@/components/ui';

export default function ResetPassword() {
  const [email, setEmail] = React.useState('');

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
      </Container.Box>
      <Container.Box containerClassName="absolute bottom-16 w-full self-center">
        <CustomButton label="Continue" onPress={() => {}} />
      </Container.Box>
    </Container.Page>
  );
}
