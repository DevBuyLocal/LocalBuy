import Feather from '@expo/vector-icons/build/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { FlatList } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Lightbox from 'react-native-lightbox-v2';
import Share from 'react-native-share';
import { twMerge } from 'tailwind-merge';

import { type TProduct } from '@/api';
import { useAddCartItem, useGetCartItems } from '@/api/cart';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Image, Pressable, Radio, Text, View, WIDTH } from '../ui';
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

  const [quantity, setQuantity] = React.useState<number>(1);

  const ref = React.useRef<any>(null);
  const { token } = useAuth();
  const { products_in_cart } = useCart(CartSelector);
  const { data } = useGetCartItems();
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });

  const cartItems = token ? data?.items || [] : products_in_cart || [];

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

  const foundItem = cartItems.find(
    (item) => item?.productOption?.id === selectedOption?.id
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

  const SECTIONS = [
    {
      title: (
        <View className="flex-row justify-between">
          <Text className="text-[14px]">Description</Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: (
        <View className="w-[95%]">
          <Text className="pt-5 text-justify">{item?.description}</Text>
        </View>
      ),
    },
    {
      title: (
        <View className="flex-row justify-between">
          <Text
            className={twMerge(
              'text-[14px]',
              selectedOption?.moq ? 'opacity-100' : 'opacity-55'
            )}
          >
            Choose {selectedOption?.unit}
          </Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: (
        <View className={twMerge('pt-5')}>
          {item?.options?.map((e, i) => (
            <View key={i.toString()} className="py-2">
              <Radio.Root
                checked={e.id === selectedOption?.id}
                onChange={() => setSelectedOption(e)}
                accessibilityLabel="radio button"
                className="justify-between pb-2"
              >
                <Radio.Label
                  text={e.value + ' ' + e.unit}
                  className="text-[14px]"
                />
                <Radio.Icon checked={selectedOption?.id === e.id} />
              </Radio.Root>
            </View>
          ))}
        </View>
      ),
    },
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
        <View className={twMerge('mt-5 pt-5')}>
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
        <View className="flex-row justify-between">
          <Text className="text-[14px]">Save for later</Text>
          <Ionicons name="bookmark-outline" size={24} color="black" />
        </View>
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
          <Text className="mb-3 text-[24px] font-medium">
            N{selectedOption?.price?.toLocaleString()}
          </Text>

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
          <View className="mt-10">
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
                // addToCart(props.item);
              }}
            />
            {/* // )} */}
          </View>
        </Container.Box>
        <Container.Box containerClassName="bg-[#F7F7F7]">
          {/* <ProductCarousel title={'Suggested Products'} /> */}
        </Container.Box>
        <View className="mb-10" />
      </BottomSheetScrollView>
    </Container.Page>
  );
}
