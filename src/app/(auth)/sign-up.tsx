import { useRouter } from 'expo-router';
import React from 'react';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { Text } from '@/components/ui';

export default function SignUp() {
  const { replace } = useRouter();
  // const signIn = useAuth.use.signIn();

  return (
    <Container.Page showHeader headerTitle="Create an account">
      <Container.Box>
        <Text className="mt-5 w-4/5 text-[25px] font-bold">
          Let’s get you signed up and shopping.
        </Text>
        <Text className="mt-2  text-[16px] opacity-75">
          Enter your email to get started
        </Text>

        <CustomInput
          placeholder="Email address"
          containerClass="mt-10"
          keyboardType="email-address"
        />
      </Container.Box>
    </Container.Page>
  );
}
