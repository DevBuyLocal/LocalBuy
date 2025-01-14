import React from 'react';
import { type PressableProps } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { twMerge } from 'tailwind-merge';

import { CartSelector, useCart } from '@/lib/cart';

import CustomButton from '../general/custom-button';
import { Image, Pressable, Text, View } from '../ui';
import QuantitySelect from './quantity-select';

interface ProductItemProps extends Partial<PressableProps> {
  item: any;
  containerClassname?: string | undefined;
}

function ProductItem(props: ProductItemProps) {
  const { addToCart, products_in_cart } = useCart(CartSelector);
  const [imgSrc, setImgSrc] = React.useState(props?.item?.images[0]);

  const isInCart = products_in_cart.find(
    (item: any) => item?.id === props?.item?.id
  );

  return (
    <Pressable
      className={twMerge(
        'w-[158px] rounded-[2px] bg-[#FFFFFF] px-[10px] py-[5px] justify-between',
        props.containerClassname
      )}
      onPress={() => {}}
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
  );
}

export default ProductItem;
