import { useRouter } from 'expo-router';
import React from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomCheckbox from '@/components/general/custom-checkbox';
import CustomInput from '@/components/general/custom-input';
import { Pressable, Text } from '@/components/ui';

export default function Login() {
  const { replace } = useRouter();
  // const signIn = useAuth.use.signIn();
  // const { setLoading } = useLoader();
  // useEffect(() => {
  //   setLoading(false);
  // }, []);

  return (
    <Container.Page showHeader headerTitle="Log in">
      <Container.Box>
        <Text className="mt-5 w-4/5 text-[25px] font-bold">Welcome back</Text>
        <Text className="mt-2 text-[16px] opacity-75">
          Login to resume your shopping experience
        </Text>
        <CustomInput
          placeholder="Email address"
          containerClass="mt-[18px]"
          keyboardType="email-address"
        />
        <CustomInput placeholder="Password" isPassword containerClass="mb-5" />
        <CustomCheckbox
          label={'Keep me signed in'}
          description="By checking this box you won’t have to sign in as often on this device. For your security, we recommend only checking this box on personal devices."
        />
      </Container.Box>

      <Container.Box containerClassName="absolute bottom-16 w-full self-center">
        <CustomButton label="Continue" />
        <Pressable
          className="mt-2 flex-row self-center"
          onPress={() => replace('/sign-up')}
        >
          <Text className="color-[#121212BF]">Don't have an account? </Text>
          <Text className="color-primaryText">Sign up</Text>
        </Pressable>
      </Container.Box>
    </Container.Page>
  );
}
