import { useRouter } from 'expo-router';

import { Text } from '@/components/ui';

export default function Cart() {
  const { push } = useRouter();
  return (
    <Text
      onPress={() => {
        push('/settings');
      }}
    >
      Cart
    </Text>
  );
}
