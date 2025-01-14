import { useRouter } from 'expo-router';

import Container from '@/components/general/container';
import GridProducts from '@/components/products/grid-products';
import { Text } from '@/components/ui';
import { CartSelector, useCart } from '@/lib/cart';

export default function Cart() {
  const { push } = useRouter();
  const { clearCart, products_in_cart } = useCart(CartSelector);
  return (
    <Container.Page showHeader hideBackButton headerTitle="My Cart">
      <Container.Box containerClassName="bg-[#F7F7F7]">
        <Text
          onPress={() => {
            push('/settings');
          }}
        >
          Cart
        </Text>

        <Text onPress={clearCart}>clear cart</Text>
        <GridProducts items={products_in_cart || []} isLoading={false} />
      </Container.Box>
    </Container.Page>
  );
}
