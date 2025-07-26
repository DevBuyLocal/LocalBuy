import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable } from 'react-native';

import { useGetProducts } from '@/api';
import { useGetCartItems } from '@/api/cart/use-get-cart-items';
import { useRemoveCartItem } from '@/api/cart/use-remove-cart-item';
import { useCheckoutOrder } from '@/api/order/use-checkout-order';
import { useScheduleOrder } from '@/api/order/use-schedule-order';
import { useGetSavedProducts } from '@/api/product/use-get-saved-products';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import Empty from '@/components/general/empty';
import CartItem from '@/components/products/cart-item';
import ProductCarousel from '@/components/products/product-carousel';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

// eslint-disable-next-line max-lines-per-function
export default function Cart() {
  const { push } = useRouter();
  const { token } = useAuth();
  const { clearCart, products_in_cart } = useCart(CartSelector);
  const { setError, setLoading, loading, setSuccess, setLoadingText } =
    useLoader({
      showLoadingPage: true,
    });
  const [isClearingCart, setIsClearingCart] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState<'checkout' | 'schedule' | null>(null);

  useGetProducts({})();
  const { data, error } = useGetCartItems();
  const cartItems = React.useMemo(
    () => {
      const items = token ? data?.data?.items || [] : products_in_cart || [];
      console.log('🛒 Cart Items Debug:', {
        token: !!token,
        backendItems: data?.data?.items?.length || 0,
        localItems: products_in_cart?.length || 0,
        finalItems: items.length,
        sampleItem: items[0],
        dataStructure: data ? Object.keys(data) : 'no data'
      });
      return items;
    },
    [token, data?.data?.items, products_in_cart]
  );

  const { data: savedProducts } = useGetSavedProducts()();

  const sortCartItemsByCreatedAt = React.useMemo(
    () =>
      cartItems.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [cartItems]
  );

  const totalPrice = React.useMemo(
    () => {
      // Use backend calculated total if available, otherwise calculate locally
      if (token && data?.data?.summary?.totalPrice) {
        console.log('💰 Cart: Using backend totalPrice:', data.data.summary.totalPrice);
        console.log('💰 Cart Backend Summary Debug:', {
          backendTotal: data.data.summary.totalPrice,
          backendItems: data?.data?.items?.length || 0,
          backendItemsDetails: data?.data?.items?.map(item => ({
            productName: item.productOption?.product?.name,
            quantity: item.quantity,
            price: item.productOption?.price,
            total: item.productOption?.price * item.quantity
          })) || []
        });
        return data.data.summary.totalPrice;
      }
      // Fallback to local calculation for offline cart
      const localTotal = sortCartItemsByCreatedAt.reduce(
        (sum: number, item: any) => sum + item?.productOption?.price * item?.quantity,
        0
      );
      console.log('💰 Cart: Using local totalPrice:', localTotal, {
        cartItems: sortCartItemsByCreatedAt.length,
        token: !!token,
        backendData: data?.data?.summary,
        localItemsDetails: sortCartItemsByCreatedAt.map(item => ({
          productName: item.productOption?.product?.name,
          quantity: item.quantity,
          price: item.productOption?.price,
          total: item.productOption?.price * item.quantity
        }))
      });
      return localTotal;
    },
    [token, data?.data?.summary?.totalPrice, sortCartItemsByCreatedAt]
  );

  const totalQuantity = React.useMemo(
    () =>
      sortCartItemsByCreatedAt.reduce(
        (sum: number, item: any) => sum + item?.quantity,
        0
      ),
    [sortCartItemsByCreatedAt]
  );

  const { mutate: removeItem } = useRemoveCartItem({
    onSuccess: () => {
      // setLoading(false);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      // setLoading(false);
    },
  });

  const { mutate: createOrder } = useCheckoutOrder({
    onSuccess: (data) => {
      const orderId = data?.order?.id;
      console.log('🛒 Cart to Checkout Debug:', {
        orderId,
        totalPrice,
        totalPriceType: typeof totalPrice,
        cartItems: sortCartItemsByCreatedAt.length,
        fullResponse: data,
        responseKeys: data ? Object.keys(data) : 'no data'
      });
      if (orderId) {
        // Navigate based on the current action
        if (currentAction === 'checkout') {
          console.log('🚀 Navigating to checkout with:', { orderId, totalPrice });
          push(`/checkout?orderId=${orderId}&price=${totalPrice}`);
        } else if (currentAction === 'schedule') {
          console.log('🚀 Navigating to schedule with:', { orderId, totalPrice });
          push(`/schedule-order?orderId=${orderId}&price=${totalPrice}`);
        }
      } else {
        setError('Failed to create order');
      }
    },
    onError: (error) => {
      console.log('🚨 Checkout Order Error:', {
        error,
        errorMessage: error?.message,
        errorResponse: error?.response?.data,
        errorStatus: error?.response?.status,
        cartItemsAtError: sortCartItemsByCreatedAt.length
      });
      setError(error?.response?.data || error?.message || 'Failed to create order');
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  if (error) {
    return (
      <Container.Box>
        <Text>Error fetching cart items. Please try again later.</Text>
      </Container.Box>
    );
  }

  function redirectToCheckout() {
    console.log('🛒 Checkout Clicked Debug:', {
      hasToken: !!token?.access,
      cartItemsLength: sortCartItemsByCreatedAt.length,
      totalPrice,
      isLoggedIn: !!token,
      backendCartItems: data?.data?.items?.length || 0,
      localCartItems: products_in_cart?.length || 0,
      cartData: data?.data
    });
    
    if (!token?.access) {
      push('/login?from=cart');
    } else {
      if (sortCartItemsByCreatedAt.length === 0) {
        setError('No items in cart to checkout');
        return;
      }
      setCurrentAction('checkout');
      setLoading(true);
      setLoadingText('Creating order for checkout');
      createOrder();
    }
  }

  function redirectToScheduleOrder() {
    if (!token?.access) {
      push('/login?from=cart');
    } else {
      setCurrentAction('schedule');
      setLoading(true);
      setLoadingText('Creating order for scheduling');
      createOrder();
    }
  }
  return (
    <Container.Page
      showHeader
      hideBackButton
      headerTitle="My Cart"
      containerClassName="flex-1"
      rightHeaderIcon={
        sortCartItemsByCreatedAt.length ? (
          <Pressable
            onPress={() => {
              if (isClearingCart) return; // Prevent multiple alerts
              
              setIsClearingCart(true);
              Alert.alert(
                'Empty cart',
                'Are you sure you want to clear your cart?',
                [
                  {
                    text: 'Yes',
                    onPress: async () => {
                      if (token) {
                        setLoading(true);
                        await Promise.all(
                          sortCartItemsByCreatedAt.map((item) =>
                            removeItem({ cartItemId: item?.id })
                          )
                        )
                          .then(() => {
                            setSuccess('Cart cleared');
                          })
                          .finally(() => {
                            setLoading(false);
                            setIsClearingCart(false);
                          });
                      } else {
                        clearCart();
                        setIsClearingCart(false);
                      }
                    },
                  },
                  { 
                    text: 'Cancel', 
                    style: 'destructive',
                    onPress: () => setIsClearingCart(false),
                  },
                ]
              );
            }}
            className="absolute right-5 top-2 z-10 my-3 size-[40px] items-center justify-center rounded-full bg-[#F7F7F7]"
          >
            <Ionicons name="trash-outline" size={24} color="black" />
          </Pressable>
        ) : undefined
      }
    >
      <Container.Box containerClassName="flex-1">
        <FlatList
          data={sortCartItemsByCreatedAt}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }: { item: any }) => (
            <CartItem 
              key={item?.id} 
              item={item} 
              savedProducts={savedProducts} 
            />
          )}
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
            Boolean(cartItems.length) ? (
              <View>
                <View className="my-3 flex-row justify-between">
                  <Text className="opacity-65">Total amount</Text>
                  <Text className="text-[16px] font-bold">
                    N{totalPrice?.toLocaleString()}
                  </Text>
                </View>
                <View className="h-px w-full bg-[#F7F7F7]" />
                <View className="my-3 flex-row justify-between">
                  <Text adjustsFontSizeToFit className="opacity-65">
                    Number of product{totalQuantity === 1 ? '' : 's'}
                  </Text>
                  <Text className="text-[16px] font-bold">
                    {totalQuantity}
                  </Text>
                </View>
                <CustomButton
                  label={'Checkout'}
                  containerClassname="mt-10"
                  onPress={() => redirectToCheckout()}
                  loading={loading}
                />
                <CustomButton.Secondary
                  label={'Scheduled Order'}
                  containerClassname="mt-3"
                  onPress={() => redirectToScheduleOrder()}
                />
                <Container.Box containerClassName="px-0 pb-20">
                  <ProductCarousel title={'Frequently bought'} />
                </Container.Box>
              </View>
            ) : undefined
          }
        />
      </Container.Box>
    </Container.Page>
  );
}
