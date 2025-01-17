import { useLocalSearchParams, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Text, View } from '@/components/ui';

export default function SignUp() {
  const { role } = useLocalSearchParams();
  const { push } = useRouter();
  // const signIn = useAuth.use.signIn();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [refer, setRefer] = React.useState('');

  return (
    <Container.Page showHeader headerTitle="Create an account">
      <InputView>
        <Text className="mt-5 w-4/5 text-[25px] font-bold">
          Let’s get you signed up and shopping.
        </Text>
        <Text className="mt-2  text-[16px] opacity-75">
          Enter your email to get started
        </Text>

        <CustomInput
          placeholder={
            role === 'individual' ? 'Email address' : 'Business email'
          }
          containerClass="mt-10"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <CustomInput
          isPassword
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <AnimatePresence>
          {password && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
              }}
              transition={{ type: 'timing', duration: 350 }}
            >
              <CustomInput
                isPassword
                placeholder="Confirm password"
                description="Must contain at least 6 characters, include uppercase, lowercase letters, and a number."
              />
              <CustomInput
                placeholder="Referral code (optional)"
                value={refer}
                onChangeText={setRefer}
                containerClass="mt-5"
              />
            </MotiView>
          )}
        </AnimatePresence>

        <View className="absolute bottom-[120px] w-full">
          <CustomButton
            label="Create account"
            disabled={!email || !password}
            onPress={() => push(`/verify?email=${email}`)}
          />
        </View>
      </InputView>
    </Container.Page>
  );
}
