import Feather from '@expo/vector-icons/build/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Lightbox from 'react-native-lightbox-v2';
import Share from 'react-native-share';
import { twMerge } from 'tailwind-merge';

import { type TProduct } from '@/api';
import { useAddCartItem, useGetCartItems } from '@/api/cart';
import { ProductSaveEmailService } from '@/api/email/use-product-save-email';
import { useGetSavedProducts } from '@/api/product/use-get-saved-products';
import { useRemoveFromSaved } from '@/api/product/use-remove-from-saved';
import { useSaveProduct } from '@/api/product/use-save-product';
import { useGetUser } from '@/api/user/use-get-user';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { calculateBulkPricing, formatBulkSavings, formatBulkSavingsPercentage } from '@/lib/utils';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { colors, Image, Pressable, Text, View, WIDTH } from '../ui';
import ProductSuggestCarousel from './product-suggest-carousel';
import QuantitySelect from './quantity-select';

// eslint-disable-next-line max-lines-per-function
export default function DetailsModal({
  dismiss,
  // isInCart,
  item,
}: {
  dismiss: () => void;
  isInCart: any;
  addToCart: (payload: any) => void;
  item: TProduct;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [activeSections, setActiveSections] = React.useState<any[]>([]);

  const { push } = useRouter();
  const [quantity, setQuantity] = React.useState<number>(1);

  const ref = React.useRef<any>(null);
  const { token } = useAuth();
  const { products_in_cart, addToCart } = useCart(CartSelector);
  const { data } = useGetCartItems();
  const { data: user } = useGetUser();
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });

  const cartItems = token ? data?.data?.items || [] : products_in_cart || [];

  const onFlatListUpdate = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }, []);

  const getFirstValidOption = (options: TProduct['options']) => {
    if (!options || !options.length) return null;

    for (let option of options) {
      if (option?.image?.length) {
        return option; // Return the first option that has an image
      }
    }
    return options[0] || null; // If no option has an image, return the first option as a fallback
  };

  const [selectedOption, setSelectedOption] = React.useState(() =>
    getFirstValidOption(item?.options)
  );

  // Debug logging for quantity changes
  console.log('🔍 Quantity Debug:', {
    quantity,
    selectedOptionId: selectedOption?.id,
    selectedOptionMoq: selectedOption?.moq
  });

  // Debug logging to see what data we're working with
  console.log('🔍 DetailsModal Debug:', {
    productName: item?.name,
    selectedOption: selectedOption,
    selectedOptionBulkPrice: selectedOption?.bulkPrice,
    selectedOptionBulkMoq: selectedOption?.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity,
    selectedOptionPrice: selectedOption?.price,
    allOptions: item?.options?.map(opt => ({
      id: opt.id,
      value: opt.value,
      price: opt.price,
      bulkPrice: opt.bulkPrice,
      bulkMoq: opt.bulkMoq,
      moq: opt.moq
    }))
  });

  const { data: savedProducts } = useGetSavedProducts()();

  const itemIsSaved = savedProducts?.savedProducts?.find(
    (item) => item?.productId === selectedOption?.productId
  );

  const foundItem = cartItems.find(
    (item: any) => item?.productOption?.id === selectedOption?.id
  );
  // console.log('🚀 ~ foundItem:', foundItem);

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (selectedOption?.image?.length) {
  //       if (activeIndex === selectedOption?.image.length - 1) {
  //         setActiveIndex(0);
  //         ref?.current?.scrollToIndex({ animated: true, index: 0 });
  //       } else {
  //         setActiveIndex(activeIndex + 1);
  //         ref?.current?.scrollToIndex({
  //           animated: true,
  //           index: activeIndex + 1,
  //         });
  //       }
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [activeIndex, selectedOption?.image?.length]);

  const { mutate } = useAddCartItem({
    onSuccess: () => {
      setSuccess('Item added to cart');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutate: saveProduct } = useSaveProduct({
    onSuccess: async () => {
      setSuccess('Product saved for later');
      
             // Send product save email notification
       try {
         if (user?.email && item) {
           await ProductSaveEmailService.sendSaveConfirmation(
             user.email,
             (user as any).fullName || (user as any).businessName || 'User',
             {
               id: item.id,
               name: item.name,
               price: selectedOption?.price || 0,
               image: selectedOption?.image?.[0] || '',
             }
           );
         }
       } catch (error) {
         console.log('Failed to send product save email:', error);
       }
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { mutate: removeFromSaved } = useRemoveFromSaved({
    onSuccess: () => {
      setSuccess('Product removed from saved');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const SECTIONS = [
    {
      title: (
        <View className="flex-row justify-between">
          <Text className="text-[14px]">View specific details</Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: (
        <View className="w-[95%]">
          <Text className="pt-5 text-justify">{item?.description}</Text>
        </View>
      ),
    },
    // Bulk Pricing Section - only show if bulk pricing is available
    ...(selectedOption?.bulkPrice && selectedOption?.bulkMoq ? [{
      title: (
        <View className="flex-row justify-between">
          <Text className="text-[14px] text-green-700 font-medium">Bulk Pricing</Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: (
        <View className="pt-5">
          <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            <Text className="text-[14px] text-green-800 font-semibold mb-2">
              🎯 Volume Discount Available
            </Text>
            <Text className="text-[13px] text-green-700 mb-3">
              Order in larger quantities to unlock better pricing
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-center justify-between bg-white rounded p-2">
                <View>
                  <Text className="text-[12px] text-gray-600">Regular Price</Text>
                  <Text className="text-[14px] font-medium">N{selectedOption.price?.toLocaleString()}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[12px] text-gray-600">→</Text>
                </View>
                <View>
                  <Text className="text-[12px] text-green-600">Bulk Price</Text>
                  <Text className="text-[14px] font-medium text-green-600">N{selectedOption.bulkPrice?.toLocaleString()}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-gray-600">Minimum Order</Text>
                <Text className="text-[12px] font-medium">{selectedOption.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity} {selectedOption.unit}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-gray-600">Savings Per Unit</Text>
                <Text className="text-[12px] font-medium text-green-600">
                  N{(selectedOption.price - selectedOption.bulkPrice)?.toLocaleString()}
                </Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-gray-600">Discount</Text>
                <Text className="text-[12px] font-medium text-green-600">
                  {(((selectedOption.price - selectedOption.bulkPrice) / selectedOption.price) * 100).toFixed(0)}% off
                </Text>
              </View>
            </View>
          </View>
          
          <Text className="text-[12px] text-gray-600">
            💡 Tip: Increase your quantity to {selectedOption.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity} or more to automatically apply the bulk discount
          </Text>
        </View>
      ),
    }] : []),

    {
      title: (
        <View className="flex-row justify-between">
          <Text
            className={twMerge(
              'text-[14px]',
              selectedOption?.moq ? 'opacity-100' : 'opacity-55'
            )}
          >
            Choose quantity
          </Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: selectedOption?.moq ? (
        <View className={twMerge('mt-5')}>
          <QuantitySelect
            quantity={quantity}
            setQuantity={setQuantity}
            useWithoutApi
            itemId={selectedOption?.id}
            selectedOption={selectedOption}
            removeOnZero={false}
            containerClass="border-0 mt-0"
          />
        </View>
      ) : (
        <></>
      ),
    },
    {
      title: (
        <Pressable
          className="flex-row justify-between"
          onPress={() => {
            if (token) {
              if (itemIsSaved) {
                removeFromSaved({
                  productId: itemIsSaved?.product?.id,
                });
                return;
              }
              saveProduct({
                productId: item?.id,
              });
              return;
            }
            push('/login');
          }}
        >
          <Text className="text-[14px]">
            {itemIsSaved ? 'Remove from saved' : 'Save for later'}
          </Text>
          <Ionicons
            name={itemIsSaved ? 'bookmark-sharp' : 'bookmark-outline'}
            size={24}
            color={itemIsSaved ? colors.primaryText : 'black'}
          />
        </Pressable>
      ),
      content: <></>,
    },
  ];

  return (
    <Container.Page>
      <View className="fixed top-0 h-16 flex-row items-center justify-between border-b border-[#12121214] px-5">
        <Pressable onPress={dismiss}>
          <Feather name="x" size={24} color="black" />
        </Pressable>

        <Pressable
          className="py-2 pl-5"
          onPress={() =>
            Share.open({
              message: `Buy ${item?.name} from buy-local`,
              url: 'buylocal.app',
            })
          }
        >
          <Ionicons name="share-social-outline" size={28} color="black" />
        </Pressable>
      </View>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <View className="h-[350px] w-full bg-[#F7F7F7]">
          <FlatList
            data={selectedOption?.image}
            renderItem={({ item }) => (
              //@ts-ignore
              <Lightbox
                backgroundColor="#121212"
                springConfig={{ tension: 15, friction: 7 }}
              >
                <View>
                  <Image
                    source={{ uri: item }}
                    style={{ width: WIDTH, height: 300 }}
                  />
                </View>
              </Lightbox>
            )}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            snapToAlignment={'center'}
            decelerationRate={'fast'}
            snapToInterval={WIDTH}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            horizontal
            onViewableItemsChanged={onFlatListUpdate}
            ref={ref}
          />

          <BottomSheetScrollView
            horizontal
            className={'gap-5 px-5 py-2'}
            showsHorizontalScrollIndicator={false}
          >
            {selectedOption?.image?.map((e, i) => (
              <Pressable
                key={i.toString()}
                onPress={() => {
                  setActiveIndex(i);
                  ref?.current?.scrollToIndex({ animated: true, index: i });
                }}
              >
                <Image
                  source={{ uri: e }}
                  className="mr-3 size-[65px] rounded-md border-primaryText bg-[#F7F7F7]"
                  style={{ borderWidth: i === activeIndex ? 1 : undefined }}
                />
              </Pressable>
            ))}
          </BottomSheetScrollView>
        </View>

        <Container.Box containerClassName="flex-1">
          <Text className="my-3 text-[16px] font-[200] opacity-75">
            {item?.name}
          </Text>
          
          {/* Enhanced Bulk Pricing Display */}
          {(() => {
            const bulkInfo = calculateBulkPricing(
              quantity,
              selectedOption?.price || 0,
              selectedOption?.bulkPrice,
              selectedOption?.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity
            );
            
            // Show bulk pricing only if the product actually supports it
            const supportsBulkPricing = selectedOption?.bulkPricingDetails?.supportsBulkPricing;
            const hasBulkData = selectedOption?.bulkPrice && (selectedOption?.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity);
            const finalShouldShow = supportsBulkPricing && hasBulkData;
            
            return (
              <View className="mb-4">
                {/* Main Price Display */}
                <View className="flex-row items-center gap-2 mb-2">
                  <Text className="text-[24px] font-medium">
                    N{bulkInfo.currentPrice?.toLocaleString()}
                  </Text>
                  {bulkInfo.isBulkActive && (
                    <Text className="text-[16px] font-medium text-gray-500 line-through">
                      N{bulkInfo.originalPrice?.toLocaleString()}
                    </Text>
                  )}
                </View>
                
                {/* Bulk Pricing Information */}
                {finalShouldShow && (
                  <View className="bg-green-50 border border-green-200 rounded-lg p-3">
                    {!bulkInfo.isBulkActive ? (
                      <View>
                        <Text className="text-[14px] text-green-800 font-semibold mb-1">
                          🎯 Bulk Pricing Available
                        </Text>
                        <Text className="text-[13px] text-green-700 mb-2">
                          Buy {selectedOption?.bulkMoq || selectedOption?.bulkPricingDetails?.minimumQuantity || 10} or more to unlock distributor pricing
                        </Text>
                        <View className="flex-row items-center justify-between bg-white rounded p-2">
                          <View>
                            <Text className="text-[12px] text-gray-600">Regular Price</Text>
                            <Text className="text-[14px] font-medium">N{selectedOption?.price?.toLocaleString()}</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-[12px] text-gray-600">→</Text>
                          </View>
                          <View>
                            <Text className="text-[12px] text-green-600">Bulk Price</Text>
                            <Text className="text-[14px] font-medium text-green-600">N{(selectedOption?.bulkPrice || (selectedOption?.price ? selectedOption.price * 0.8 : 0))?.toLocaleString()}</Text>
                          </View>
                        </View>
                        <Text className="text-[11px] text-green-600 mt-1">
                          Save N{((selectedOption?.price || 0) - (selectedOption?.bulkPrice || (selectedOption?.price ? selectedOption.price * 0.8 : 0)))?.toLocaleString()} per unit
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text className="text-[14px] text-green-800 font-semibold mb-1">
                          ✅ Bulk Discount Applied
                        </Text>
                        <Text className="text-[13px] text-green-700 mb-2">
                          You're getting the distributor price for ordering {quantity} units
                        </Text>
                        <View className="flex-row items-center justify-between bg-white rounded p-2">
                          <View>
                            <Text className="text-[12px] text-gray-600">Original Price</Text>
                            <Text className="text-[14px] font-medium line-through text-gray-500">N{bulkInfo.originalPrice?.toLocaleString()}</Text>
                          </View>
                          <View className="items-center">
                            <Text className="text-[12px] text-green-600">→</Text>
                          </View>
                          <View>
                            <Text className="text-[12px] text-green-600">Your Price</Text>
                            <Text className="text-[14px] font-medium text-green-600">N{bulkInfo.currentPrice?.toLocaleString()}</Text>
                          </View>
                        </View>
                        <Text className="text-[11px] text-green-600 mt-1">
                          You saved {formatBulkSavings(bulkInfo.savings)} per unit ({formatBulkSavingsPercentage(bulkInfo.savingsPercentage)} off)
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })()}

          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderSectionTitle={undefined}
            underlayColor="transparent"
            renderHeader={(section) => (section?.title ? section.title : <></>)}
            renderContent={(section) => section.content}
            onChange={(i) => {
              setActiveSections(i);
            }}
            sectionContainerStyle={{
              borderWidth: 1,
              marginBottom: 8,
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderRadius: 5,
              borderColor: '#1212121A',
            }}
            containerStyle={{ marginTop: 10 }}
          />
          <Text numberOfLines={1} className="mt-5 text-[16px]">
            Minimum purchase: {selectedOption?.moq} {selectedOption?.unit}
          </Text>

          <View className="mt-5">
            {/* {foundItem ? (
              <CustomButton label={'Proceed to checkout'} />
            ) : ( */}
            <CustomButton
              label={foundItem ? 'Added to cart' : 'Add to cart'}
              disabled={Boolean(foundItem) || !Boolean(selectedOption?.moq)}
              loading={loading}
              onPress={async () => {
                if (token && selectedOption) {
                  setLoading(true);
                  mutate({
                    productOptionId: selectedOption?.id,
                    quantity,
                  });
                }
                if (!token && selectedOption) {
                  addToCart({
                    id: products_in_cart?.length + 1,
                    cartId: 0,
                    productOption: {
                      createdAt: new Date(selectedOption?.createdAt),
                      id: selectedOption?.id,
                      value: selectedOption?.value,
                      price: selectedOption?.price,
                      moq: selectedOption?.moq,
                      image: selectedOption?.image,
                      productId: selectedOption?.productId,
                      unit: selectedOption?.unit,
                      updatedAt: new Date(selectedOption?.updatedAt),
                      product: {
                        id: item.id,
                        name: item?.name,
                        description: item?.description,
                        categoryId: item?.categoryId,
                        manufacturerId: item?.manufacturerId,
                        createdAt: new Date(item?.createdAt),
                        updatedAt: new Date(item?.updatedAt),
                      },
                    },
                    quantity: 1,
                  });
                  setSuccess('Item added to cart');
                }
              }}
            />
          </View>
        </Container.Box>
        <Container.Box containerClassName="bg-[#F7F7F7]">
          <ProductSuggestCarousel title={'Suggested Products'} />
        </Container.Box>
        <View className="mb-10" />
      </BottomSheetScrollView>
    </Container.Page>
  );
}
