import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, Modal } from 'react-native';

import { useGetProducts } from '@/api';
import { useGetUser } from '@/api';
import { useGetCartItems } from '@/api/cart/use-get-cart-items';
import { useRemoveCartItem } from '@/api/cart/use-remove-cart-item';
import { useCheckoutOrder } from '@/api/order/use-checkout-order';
import { useScheduleOrder } from '@/api/order/use-schedule-order';
import { useGetSavedProducts } from '@/api/product/use-get-saved-products';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import Empty from '@/components/general/empty';
import VerificationBanner from '@/components/general/verification-banner';
import CartItem from '@/components/products/cart-item';
import ProductCarousel from '@/components/products/product-carousel';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { calculateBulkPricing, formatBulkSavings } from '@/lib/utils';

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
  const [paymentMethod, setPaymentMethod] = React.useState<'payNow' | 'payOnDelivery' | null>(null);
  const [showDeliveryFeePopup, setShowDeliveryFeePopup] = React.useState(false);
  const [deliveryFeeApplied, setDeliveryFeeApplied] = React.useState(false);
  const [isPartialPayment, setIsPartialPayment] = React.useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = React.useState(false);
  const [showCalculatingModal, setShowCalculatingModal] = React.useState(false);

  useGetProducts({})();
  const { data, error } = useGetCartItems();
  const { data: user } = useGetUser();
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
    [token, data, products_in_cart]
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
    [token, data, sortCartItemsByCreatedAt]
  );

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

    const overallSavingsPercentage = totalOriginalPrice > 0 
      ? ((totalOriginalPrice - totalBulkPrice) / totalOriginalPrice) * 100 
      : 0;

    const summary = {
      hasBulkDiscount: itemsWithBulkDiscount > 0,
      totalSavings,
      itemsWithBulkDiscount,
      overallSavingsPercentage,
      totalOriginalPrice,
      totalBulkPrice
    };

    // Debug logging for bulk pricing summary
    console.log('🛒 Bulk Pricing Summary Debug:', {
      cartItemsCount: sortCartItemsByCreatedAt.length,
      hasBulkDiscount: summary.hasBulkDiscount,
      itemsWithBulkDiscount: summary.itemsWithBulkDiscount,
      totalSavings: summary.totalSavings,
      overallSavingsPercentage: summary.overallSavingsPercentage,
      cartItemsDetails: sortCartItemsByCreatedAt.map(item => ({
        productName: item.productOption?.product?.name,
        quantity: item.quantity,
        regularPrice: item.productOption?.price,
        bulkPrice: item.productOption?.bulkPrice,
        bulkMoq: item.productOption?.bulkMoq,
        hasBulkPricing: item.productOption?.bulkPrice && item.productOption?.bulkMoq
      }))
    });

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

  // Delivery fee calculation
  const deliveryFee = 1000; // Fixed delivery fee
  const totalWithDelivery = totalPrice + deliveryFee;
  // For pay on delivery, only pay delivery fee now, products later
  const totalWithPartialDelivery = deliveryFee;

  // Handle delivery fee selection
  const handlePayNowClick = () => {
    setPaymentMethod('payNow');
    setIsPartialPayment(false);
    setShowCalculatingModal(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setShowCalculatingModal(false);
      setShowDeliveryFeePopup(true);
    }, 2000);
  };

  const handlePayOnDeliveryClick = () => {
    setPaymentMethod('payOnDelivery');
    setIsPartialPayment(true);
    setShowCalculatingModal(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setShowCalculatingModal(false);
      setShowDeliveryFeePopup(true);
    }, 2000);
  };

  const handleDeliveryFeeProceed = () => {
    setDeliveryFeeApplied(true);
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

  const handleDeliveryFeeCancel = () => {
    setShowDeliveryFeePopup(false);
    setShowDeliveryDropdown(false);
  };

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
          const checkoutAmount = deliveryFeeApplied 
            ? (paymentMethod === 'payOnDelivery' ? totalWithPartialDelivery : totalWithDelivery)
            : totalPrice;
          const productPrice = totalPrice; // Original product price
          console.log('🚀 Navigating to checkout with:', { orderId, checkoutAmount, paymentMethod, productPrice });
          push(`/checkout?orderId=${orderId}&price=${checkoutAmount}&hasDeliveryFee=${deliveryFeeApplied}&paymentMethod=${paymentMethod}&productPrice=${productPrice}`);
        } else if (currentAction === 'schedule') {
          const scheduleAmount = deliveryFeeApplied 
            ? (paymentMethod === 'payOnDelivery' ? totalWithPartialDelivery : totalWithDelivery)
            : totalPrice;
          const productPrice = totalPrice; // Original product price
          console.log('🚀 Navigating to schedule with:', { orderId, scheduleAmount, paymentMethod, productPrice });
          push(`/schedule-order?orderId=${orderId}&price=${scheduleAmount}&paymentMethod=${paymentMethod}&productPrice=${productPrice}`);
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
    <View className="flex-1">
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
          {/* Show verification banner for unverified users */}
          {user && !user.isVerified && (
            <VerificationBanner email={user.email} />
          )}

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
                  'You don\'t have any items in your cart. Let\'s get shopping!'
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
                    <View className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="pricetag-outline" size={16} color="#166534" />
                          <Text className="text-[14px] font-semibold text-green-800">
                            Bulk discount applied: You saved ₦{bulkPricingSummary.totalSavings?.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-[12px] text-green-700 mb-1">
                        {bulkPricingSummary.itemsWithBulkDiscount} item{bulkPricingSummary.itemsWithBulkDiscount > 1 ? 's' : ''} with bulk pricing • {bulkPricingSummary.overallSavingsPercentage?.toFixed(0)}% off
                      </Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-[11px] text-green-600 font-medium">
                          Original: N{bulkPricingSummary.totalOriginalPrice?.toLocaleString()}
                        </Text>
                        <Text className="text-[11px] text-green-600 font-medium">
                          With discount: N{bulkPricingSummary.totalBulkPrice?.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Delivery Fee Selection */}
                  <View className="mt-4 mb-2">
                    {/* Delivery Dropdown */}
                    <Pressable
                      onPress={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
                      className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    >
                      <Text className="text-[14px]">
                        {paymentMethod === 'payNow' ? 'Pay Now (Full Payment)' : 
                         paymentMethod === 'payOnDelivery' ? 'Pay on Delivery (Split Payment)' : 
                         'Delivery Fee Selection'}
                      </Text>
                      <Ionicons 
                        name={showDeliveryDropdown ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#666" 
                      />
                    </Pressable>

                    {/* Dropdown Options */}
                    {showDeliveryDropdown && (
                      <View className="mt-2 border border-gray-200 rounded-lg bg-white">
                        <Pressable
                          onPress={() => {
                            handlePayNowClick();
                            setShowDeliveryDropdown(false);
                          }}
                          className="p-3 border-b border-gray-100"
                        >
                          <View className="flex-row items-start gap-3">
                            <View className="mt-1">
                              <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                                paymentMethod === 'payNow' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                              }`}>
                                {paymentMethod === 'payNow' && (
                                  <View className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </View>
                            </View>
                            <View className="flex-1">
                              <View className="flex-row items-center gap-2 mb-1">
                                <Text className="text-[12px] font-medium text-gray-500">Option 1</Text>
                                <Text className="text-[14px] font-semibold">Pay Now (Full Payment)</Text>
                              </View>
                              <Text className="text-[12px] font-bold text-gray-700 mb-1">
                                (Pay for both product and delivery now.)
                              </Text>
                              <View className="flex-row items-center gap-1">
                                <Ionicons name="information-circle" size={12} color="#f97316" />
                                <Text className="text-[11px] text-gray-600">
                                  Covers full delivery cost upfront. No extra charges upon delivery.
                                </Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            handlePayOnDeliveryClick();
                            setShowDeliveryDropdown(false);
                          }}
                          className="p-3"
                        >
                          <View className="flex-row items-start gap-3">
                            <View className="mt-1">
                              <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                                paymentMethod === 'payOnDelivery' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                              }`}>
                                {paymentMethod === 'payOnDelivery' && (
                                  <View className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </View>
                            </View>
                            <View className="flex-1">
                              <View className="flex-row items-center gap-2 mb-1">
                                <Text className="text-[12px] font-medium text-gray-500">Option 2</Text>
                                <Text className="text-[14px] font-semibold">Pay on Delivery (Split Payment)</Text>
                              </View>
                              <Text className="text-[12px] font-bold text-gray-700 mb-1">
                                (Pay the delivery fee now, and pay for the product when it's delivered)
                              </Text>
                              <View className="flex-row items-center gap-1">
                                <Ionicons name="information-circle" size={12} color="#f97316" />
                                <Text className="text-[11px] text-gray-600">
                                  Pay Split Payment now; the remaining balance is due upon delivery.
                                </Text>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      </View>
                    )}
                  </View>

                  {/* Payment Method Note */}
                  {!paymentMethod && (
                    <View className="mt-2 flex-row items-center gap-2">
                      <Ionicons name="warning" size={16} color="#f97316" />
                      <Text className="text-[12px] text-gray-600">
                        Select a payment method before checkout.
                      </Text>
                    </View>
                  )}

                  {/* Bulk Pricing Message - Green Container */}
                  {bulkPricingSummary.hasBulkDiscount && (
                    <View className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Text className="text-[14px] text-green-700 font-medium">
                        Bulk discount applied: You saved ₦{bulkPricingSummary.totalSavings?.toLocaleString()} total ({bulkPricingSummary.overallSavingsPercentage?.toFixed(0)}% off)
                      </Text>
                    </View>
                  )}

                  {/* Total Amount Display */}
                  <View className="my-3 flex-row justify-between">
                    <Text className="text-[16px] font-semibold">
                      {deliveryFeeApplied ? 'Total amount' : 'Subtotal'}
                    </Text>
                    <Text className="text-[18px] font-bold text-green-600">
                      N{(deliveryFeeApplied 
                        ? (paymentMethod === 'payOnDelivery' ? totalWithPartialDelivery : totalWithDelivery)
                        : totalPrice)?.toLocaleString()}
                    </Text>
                  </View>

                  {/* Number of Products */}
                  <View className="mb-3 flex-row justify-between">
                    <Text className="text-[14px] text-gray-600 font-semibold">
                      Number of products
                    </Text>
                    <Text className="text-[14px] text-black font-bold">
                      {totalQuantity}
                    </Text>
                  </View>

                  <CustomButton
                    label={'Checkout'}
                    containerClassname="mt-4"
                    onPress={() => redirectToCheckout()}
                    loading={loading}
                    disabled={!paymentMethod || !deliveryFeeApplied}
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

      {/* Overlays */}
      {showCalculatingModal && (
        <View 
          className="absolute inset-0 bg-black/50 justify-center items-center px-4"
          style={{ zIndex: 9999 }}
        >
          <View className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <View className="items-center">
              <View className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent mb-4" />
              <Text className="text-[18px] font-bold text-center text-gray-800">
                Calculating...
              </Text>
            </View>
          </View>
        </View>
      )}

      {showDeliveryFeePopup && (
        <View 
          className="absolute inset-0 bg-black/50 justify-center items-center px-4"
          style={{ zIndex: 9999 }}
        >
          <View className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <Text className="text-[18px] font-bold mb-4 text-center text-gray-800">
              Delivery Fee
            </Text>
            
            <View className="mb-6">
              <Text className="text-[24px] font-bold text-center text-gray-800 mb-4">
                NGN {isPartialPayment ? totalWithPartialDelivery : deliveryFee}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleDeliveryFeeCancel}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white"
              >
                <Text className="text-center font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeliveryFeeProceed}
                className="flex-1 py-3 px-4 bg-orange-500 rounded-lg"
              >
                <Text className="text-center font-semibold text-white">Proceed</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
