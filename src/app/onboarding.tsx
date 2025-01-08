import { useRouter } from 'expo-router';
import React from 'react';

import { Button, View } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex  items-center">
      <Button
        label="Let's Get Started "
        onPress={() => {
          setIsFirstTime(false);
          router.replace('/login');
        }}
      />
    </View>
  );
}
