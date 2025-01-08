import { useRouter } from 'expo-router';
import React from 'react';

import { Button, Text, View } from '@/components/ui';

export default function Login() {
  const { replace } = useRouter();
  // const signIn = useAuth.use.signIn();

  return (
    <View className="p-5">
      <Text>Login Page</Text>
      <Button label="Sign-up" onPress={() => replace('/sign-up')} />
    </View>
  );
}
