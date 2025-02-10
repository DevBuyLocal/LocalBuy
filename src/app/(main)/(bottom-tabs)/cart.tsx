import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import { Alert, FlatList, Pressable } from 'react-native';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import Empty from '@/components/general/empty';
import CartItem from '@/components/products/cart-item';
import ProductCarousel from '@/components/products/product-carousel';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';

import dummyProducts from '../../../lib/dummy';

export default function Cart() {
  const { push } = useRouter();
  const { token } = useAuth();
  const { clearCart, total, totalPrice, products_in_cart } =
    useCart(CartSelector);

  function redirectToLoginAndBack(path: Href) {
    if (!token?.access) {
      push('/login?from=cart');
    } else {
      push(path);
    }
  }
  return (
    <Container.Page
      showHeader
      hideBackButton
      headerTitle="My Cart"
      containerClassName="flex-1"
      rightHeaderIcon={
        products_in_cart.length ? (
          <Pressable
            onPress={() =>
              Alert.alert(
                'Empty cart',
                'Are you sure you want to clear your cart?',
                [
                  { text: 'Yes', onPress: () => clearCart() },
                  { text: 'Cancel', style: 'destructive' },
                ]
              )
            }
            className="absolute right-5 top-2 z-10 my-3 size-[40px] items-center justify-center rounded-full bg-[#F7F7F7]"
          >
            <Ionicons name="trash-outline" size={24} color="black" />
          </Pressable>
        ) : undefined
      }
    >
      <Container.Box containerClassName="">
        <FlatList
          data={products_in_cart || []}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => <CartItem item={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Empty
              desc={
                'You don’t have any items in your cart. Let’s get shopping!'
              }
              buttonView={
                <CustomButton.Secondary
                  label={'Browse products'}
                  containerClassname="w-full mt-16"
                  onPress={() => {
                    push('/');
                  }}
                />
              }
            />
          }
          ItemSeparatorComponent={() => (
            <View className="my-3 h-px w-full bg-[#F7F7F7]" />
          )}
          ListFooterComponent={
            Boolean(products_in_cart.length) ? (
              <View>
                <View className="my-3 flex-row justify-between">
                  <Text className="opacity-65">Total amount</Text>
                  <Text className="text-[16px] font-bold">
                    N{totalPrice?.toLocaleString()}
                  </Text>
                </View>
                <View className="h-px w-full bg-[#F7F7F7]" />
                <View className="my-3 flex-row justify-between">
                  <Text className="opacity-65">Number of product(s)</Text>
                  <Text className="text-[16px] font-bold">
                    {total?.toLocaleString()}
                  </Text>
                </View>
                <CustomButton
                  label={'Checkout'}
                  containerClassname="mt-10"
                  onPress={() => redirectToLoginAndBack('/checkout')}
                />
                <CustomButton.Secondary
                  label={'Schedule order'}
                  onPress={() => redirectToLoginAndBack('/schedule-order')}
                />
                <Container.Box containerClassName="bg-[#F7F7F7] px-0 pb-40">
                  <ProductCarousel
                    items={dummyProducts}
                    title={'Frequently bought'}
                    isLoading={false}
                  />
                </Container.Box>
              </View>
            ) : undefined
          }
        />
      </Container.Box>
    </Container.Page>
  );
}
