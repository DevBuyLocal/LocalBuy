import Feather from '@expo/vector-icons/build/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { FlatList, type PressableProps } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { showMessage } from 'react-native-flash-message';
import Lightbox from 'react-native-lightbox-v2';
import Share from 'react-native-share';
import { twMerge } from 'tailwind-merge';

import { CartSelector, useCart } from '@/lib/cart';

import dummyProducts from '../../lib/dummy';
import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Image, Modal, Pressable, Text, useModal, View, WIDTH } from '../ui';
import ProductCarousel from './product-carousel';
import QuantitySelect from './quantity-select';

interface ProductItemProps extends Partial<PressableProps> {
  item: any;
  containerClassname?: string | undefined;
}

function ProductItem(props: ProductItemProps) {
  const { addToCart, products_in_cart } = useCart(CartSelector);
  const [imgSrc, setImgSrc] = React.useState(props?.item?.images[0]);

  const { present, ref, dismiss } = useModal();

  const isInCart = products_in_cart.find(
    (item: any) => item?.id === props?.item?.id
  );

  return (
    <>
      <Pressable
        className={twMerge(
          'w-[158px] rounded-[2px] bg-[#FFFFFF] px-[10px] py-[5px] justify-between',
          props.containerClassname
        )}
        onPress={present}
      >
        <View>
          <Image
            source={
              imgSrc
                ? { uri: imgSrc }
                : require('../../../assets/images/img-p-holder.png')
            }
            className="h-[95px] w-full "
            style={{
              tintColor: imgSrc ? undefined : '#D5D5D580',
              resizeMode: 'contain',
            }}
            onError={() => {
              setImgSrc(null);
            }}
          />
          <View className="mb-1 mt-3 min-h-[78px] justify-between">
            <View>
              <Text numberOfLines={2} className="text-[12px] font-bold">
                {props?.item?.name}
              </Text>
              <Text numberOfLines={1} className="mt-1 text-[10px]">
                Minimum purchase: {props?.item?.minPurchase}
              </Text>
            </View>
            <Text className="text-[14px] font-bold">
              N{Number(props?.item?.price).toLocaleString()}
            </Text>
          </View>
        </View>
        <View>
          {isInCart ? (
            <QuantitySelect itemId={props.item.id} />
          ) : (
            <CustomButton.Secondary
              label="Add to cart"
              containerClassname="border-[#0F3D30] h-[29px] rounded-[4px]"
              textClassName="text-[#0F3D30] font-regular text-[12px]"
              onPress={() => {
                addToCart(props.item);
                showMessage({
                  message: 'Added to cart!',
                  type: 'success',
                  duration: 2000,
                });
              }}
            />
          )}
        </View>
      </Pressable>
      <Modal
        ref={ref}
        snapPoints={['90%']}
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        {DetailsModal(dismiss, isInCart, addToCart, props)}
      </Modal>
    </>
  );
}

export default ProductItem;

// eslint-disable-next-line max-lines-per-function
function DetailsModal(
  dismiss: () => void,
  isInCart: any,
  addToCart: (payload: any) => void,
  props: ProductItemProps
) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [activeSections, setActiveSections] = React.useState<any[]>([]);

  const ref = React.useRef<any>(null);

  const onFlatListUpdate = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (props?.item?.images?.length) {
        if (activeIndex === props.item.images.length - 1) {
          setActiveIndex(0);
          ref?.current?.scrollToIndex({ animated: true, index: 0 });
        } else {
          setActiveIndex(activeIndex + 1);
          ref?.current?.scrollToIndex({
            animated: true,
            index: activeIndex + 1,
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, props.item.images.length]);

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
          <Text className="pt-5 text-justify">{props?.item?.description}</Text>
        </View>
      ),
    },
    {
      title: (
        <View className="flex-row justify-between">
          <Text
            className={twMerge(
              'text-[14px]',
              props?.item?.quantity ? 'opacity-100' : 'opacity-55'
            )}
          >
            Choose quantity
          </Text>
          <Entypo name="chevron-small-down" size={20} color="black" />
        </View>
      ),
      content: props?.item?.quantity ? (
        <View className={twMerge('mt-5 pt-5')}>
          <QuantitySelect itemId={props.item.id} removeOnZero={false} />
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
              message: `Buy ${props.item?.name} from buy-local`,
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
            data={props?.item?.images || []}
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
            {props?.item?.images?.map((e, i) => (
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
            {props?.item?.name}
          </Text>
          <Text className="mb-3 text-[24px] font-medium">
            N{props?.item?.price?.toLocaleString()}
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
            {isInCart ? (
              <CustomButton label={'Proceed to checkout'} />
            ) : (
              <CustomButton
                label="Add to cart"
                onPress={() => {
                  addToCart(props.item);
                  showMessage({
                    message: 'Added to cart!',
                    type: 'success',
                    duration: 2000,
                  });
                }}
              />
            )}
          </View>
        </Container.Box>
        <Container.Box containerClassName="bg-[#F7F7F7]">
          <ProductCarousel
            items={dummyProducts}
            title={'Suggested Products'}
            isLoading={false}
          />
        </Container.Box>
        <View className="mb-10" />
      </BottomSheetScrollView>
    </Container.Page>
  );
}
