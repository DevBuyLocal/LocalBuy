import { useRouter } from 'expo-router';
import React from 'react';

import { Button, FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function SignUp() {
  const { replace } = useRouter();
  // const signIn = useAuth.use.signIn();

  return (
    <View className="p-5">
      <Text>Sign Up Page</Text>
      <FocusAwareStatusBar />
      <Button label="Login" onPress={() => replace('/login')} />
    </View>
  );
}
