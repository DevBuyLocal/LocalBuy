import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable } from 'react-native';

import { useGetProducts, useGetUser } from '@/api';
import { useGetCartItems } from '@/api/cart/use-get-cart-items';
import { useRemoveCartItem } from '@/api/cart/use-remove-cart-item';
import { 
  AbandonedCartService, 
  useTrackAbandonedCart} from '@/api/email/use-abandoned-cart-email';
import { useCheckoutOrder } from '@/api/order/use-checkout-order';
import { useGetSavedProducts } from '@/api/product/use-get-saved-products';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import Empty from '@/components/general/empty';
import CartItem from '@/components/products/cart-item';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { calculateBulkPricing } from '@/lib/utils';

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
  const [currentAction, setCurrentAction] = React.useState<
    'checkout' | 'schedule' | null
  >(null);
  

  useGetProducts({})();
  const { data, error, refetch: refetchCart } = useGetCartItems();
  
  // Add cart data debugging
  React.useEffect(() => {
    console.log('🛒 Cart page - data changed:', {
      hasData: !!data,
      itemsCount: data?.data?.items?.length || 0,
      items: data?.data?.items?.map((item: any) => item?.productOption?.id) || [],
      timestamp: new Date().toISOString()
    });
    
    // Debug cart items with bulk pricing info
    if (data?.data?.items?.length && data.data.items.length > 0) {
      data.data.items.forEach((item: any, index: number) => {
        console.log(`🛒 Cart item ${index + 1} debug:`, {
          name: item.productOption?.product?.name,
          quantity: item.quantity,
          regularPrice: item.productOption?.price,
          bulkPrice: item.productOption?.bulkPrice,
          bulkMoq: item.productOption?.bulkMoq,
          hasAllBulkData: !!(item.productOption?.bulkPrice && item.productOption?.bulkMoq),
          shouldUseBulk: item.quantity >= (item.productOption?.bulkMoq || 0),
          productOption: item.productOption
        });
      });
    }
  }, [data]);

  // Refetch cart data when cart page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🛒 Cart page focused - refetching cart data');
      refetchCart();
    }, [refetchCart])
  );
  const { data: user } = useGetUser();
  const { mutate: _trackAbandonedCart } = useTrackAbandonedCart();
  const cartItems = React.useMemo(() => {
    const items = token ? data?.data?.items || [] : products_in_cart || [];
    return items;
  }, [token, data, products_in_cart]);

  const { data: savedProducts } = useGetSavedProducts()();

  const sortCartItemsByCreatedAt = React.useMemo(
    () =>
      cartItems.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [cartItems]
  );

  const totalPrice = React.useMemo(() => {
    // Always calculate with bulk pricing to ensure accuracy
    const calculatedTotal = sortCartItemsByCreatedAt.reduce(
      (sum: number, item: any) => {
        const bulkInfo = calculateBulkPricing(
          item.quantity,
          item.productOption?.price || 0,
          item.productOption?.bulkPrice,
          item.productOption?.bulkMoq || item.productOption?.moq
        );
        
        // Debug bulk pricing calculation
        console.log('🔍 Cart total calculation debug:', {
          itemName: item.productOption?.product?.name,
          quantity: item.quantity,
          originalPrice: item.productOption?.price,
          bulkPrice: item.productOption?.bulkPrice,
          bulkMoq: item.productOption?.bulkMoq || item.productOption?.moq,
          bulkInfo,
          lineTotal: bulkInfo.currentPrice * item.quantity,
          shouldUseBulk: item.quantity >= (item.productOption?.bulkMoq || item.productOption?.moq || 0),
          expectedResult: 'If qty=5, price=3000, bulk=2500, moq=5 → should be 12500'
        });
        
        // Test your specific scenario
        if (item.quantity === 5 && item.productOption?.price === 3000 && item.productOption?.bulkPrice === 2500) {
          console.log('🎯 Found your test scenario! Expected: 12500, Actual:', bulkInfo.currentPrice * item.quantity);
        }
        
        return sum + bulkInfo.currentPrice * item.quantity;
      },
      0
    );
    
    // Use backend total only if it matches our calculation (within small margin)
    if (token && data?.data?.summary?.totalPrice) {
      const backendTotal = data.data.summary.totalPrice;
      const difference = Math.abs(backendTotal - calculatedTotal);
      
      // If backend and calculated totals are very close, use backend
      if (difference < 1) {
        return backendTotal;
      } else {
        console.log('🔍 Total price mismatch - using calculated bulk pricing:', {
          backend: backendTotal,
          calculated: calculatedTotal,
          difference
        });
      }
    }
    
    return calculatedTotal;
  }, [token, data, sortCartItemsByCreatedAt]);

  // Track abandoned cart when user has items and leaves cart page
  React.useEffect(() => {
    if (cartItems.length > 0 && user?.email && totalPrice > 0) {
      // Start abandoned cart tracking with 2-hour delay
      const cartData = cartItems.map((item: any) => ({
        id: item.productOption?.product?.id || item.id,
        name: item.productOption?.product?.name || item.name,
        quantity: item.quantity,
        price: item.productOption?.price || item.price,
        image: item.productOption?.product?.image?.[0] || item.image,
      }));

      AbandonedCartService.startTracking(
        user.email,
        cartData,
        totalPrice,
        2 // 2 hours delay
      );

      // Clear tracking when component unmounts (user navigates away)
      return () => {
        if (cartItems.length === 0) {
          // Only clear if cart is empty (completed purchase)
          AbandonedCartService.clearTracking(user.email);
        }
      };
    }
  }, [cartItems.length, user?.email, totalPrice]);

  // Bulk Pricing Summary Calculation
  const bulkPricingSummary = React.useMemo(() => {
    let totalSavings = 0;
    let itemsWithBulkDiscount = 0;
    let totalOriginalPrice = 0;
    let totalBulkPrice = 0;

    sortCartItemsByCreatedAt.forEach((item: any) => {
      const bulkInfo = calculateBulkPricing(
        item.quantity,
        item.productOption?.price || 0,
        item.productOption?.bulkPrice,
        item.productOption?.bulkMoq
      );

      if (bulkInfo.isBulkActive) {
        itemsWithBulkDiscount++;
        totalSavings += bulkInfo.savings * item.quantity;
        totalOriginalPrice += bulkInfo.originalPrice * item.quantity;
        totalBulkPrice += bulkInfo.currentPrice * item.quantity;
      } else {
        totalOriginalPrice += (item.productOption?.price || 0) * item.quantity;
        totalBulkPrice += (item.productOption?.price || 0) * item.quantity;
      }
    });

    const overallSavingsPercentage =
      totalOriginalPrice > 0
        ? ((totalOriginalPrice - totalBulkPrice) / totalOriginalPrice) * 100
        : 0;

    const summary = {
      hasBulkDiscount: itemsWithBulkDiscount > 0,
      totalSavings,
      itemsWithBulkDiscount,
      overallSavingsPercentage,
      totalOriginalPrice,
      totalBulkPrice,
    };

    return summary;
  }, [sortCartItemsByCreatedAt]);

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
      const amountToPay = data?.nextSteps?.paymentAmount || totalPrice;
      
      if (orderId) {
        // Navigate based on the current action
        if (currentAction === 'checkout') {
          push(`/checkout?orderId=${orderId}&price=${amountToPay}`);
        } else if (currentAction === 'schedule') {
          push(`/schedule-order?orderId=${orderId}&price=${amountToPay}`);
        }
      } else {
        setError('Failed to create order');
      }
    },
    onError: (error) => {
      setError(
        error?.response?.data || error?.message || 'Failed to create order'
      );
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
      
      // Create order without payment type - will be selected on checkout page
      createOrder({});
    }
  }

  function redirectToScheduleOrder() {
    if (!token?.access) {
      push('/login?from=cart');
    } else {
      setCurrentAction('schedule');
      setLoading(true);
      setLoadingText('Creating order for scheduling');
      
      // Create scheduled order - payment type will be selected later
      createOrder({
        orderType: 'SCHEDULED',
      });
    }
  }

  return (
    <View className="flex-1">
      <Container.Page
        showHeader
        backPress={() => push('/')} 
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
                  "You don't have any items in your cart. Let's get shopping!"
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
                  {/* Bulk Pricing Summary */}
                  {bulkPricingSummary.hasBulkDiscount && (
                    <View className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                      <View className="mb-2 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#166534"
                          />
                          <Text className="text-[14px] font-semibold text-green-800">
                            Bulk discount applied: You saved ₦
                            {bulkPricingSummary.totalSavings?.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <Text className="mb-1 text-[12px] text-green-700">
                        {bulkPricingSummary.itemsWithBulkDiscount} item
                        {bulkPricingSummary.itemsWithBulkDiscount > 1
                          ? 's'
                          : ''}{' '}
                        with bulk pricing •{' '}
                        {bulkPricingSummary.overallSavingsPercentage?.toFixed(
                          0
                        )}
                        % off
                      </Text>
                      <View className="mt-1 flex-row items-center gap-2">
                        <Text className="text-[11px] font-medium text-green-600">
                          Original: N
                          {bulkPricingSummary.totalOriginalPrice?.toLocaleString()}
                        </Text>
                        <Text className="text-[11px] font-medium text-green-600">
                          With discount: N
                          {bulkPricingSummary.totalBulkPrice?.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Total Amount Display */}
                  <View className="my-3 flex-row justify-between">
                    <Text className="text-[16px] font-semibold">Subtotal</Text>
                    <Text className="text-[18px] font-bold text-green-600">
                      N{totalPrice?.toLocaleString()}
                    </Text>
                  </View>

                  {/* Number of Products */}
                  <View className="mb-3 flex-row justify-between">
                    <Text className="text-[14px] font-semibold text-gray-600">
                      Number of products
                    </Text>
                    <Text className="text-[14px] font-bold text-black">
                      {totalQuantity}
                    </Text>
                  </View>


                  <CustomButton
                    label={'Checkout'}
                    containerClassname="mt-4"
                    onPress={() => redirectToCheckout()}
                    loading={loading}
                  />

                  <CustomButton.Secondary
                    label={'Scheduled Order'}
                    containerClassname="mt-3"
                    onPress={() => redirectToScheduleOrder()}
                  />
                </View>
              ) : null
            }
          />
        </Container.Box>
      </Container.Page>
    </View>
  );
}