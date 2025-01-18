import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { type PressableProps } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import { twMerge } from 'tailwind-merge';

import { CartSelector, useCart } from '@/lib/cart';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Image, Modal, Pressable, Text, useModal, View } from '../ui';
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
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <View className="top-0 h-16 flex-row items-center justify-between border-b border-[#12121214] px-5">
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
          <Container.Box containerClassName="flex-1">
            <Text>modal</Text>
          </Container.Box>
        </BottomSheetScrollView>
      </Modal>
    </>
  );
}

export default ProductItem;
