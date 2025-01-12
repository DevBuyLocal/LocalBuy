import React from 'react';
import { type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import CustomButton from '../general/custom-button';
import { Image, Pressable, Text, View } from '../ui';

interface ProductItemProps extends Partial<PressableProps> {
  item: any;
  containerClassname?: string | undefined;
}

function ProductItem(props: ProductItemProps) {
  function AddToCart(id: string) {
    console.log('🚀 ~ ProductItem ~ id:', id);
  }

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
            props?.item?.img
              ? { uri: props?.item?.img }
              : require('../../../assets/images/img-p-holder.png')
          }
          className="h-[95px] w-full "
          style={{
            tintColor: props?.item?.img ? undefined : '#D5D5D580',
            resizeMode: 'contain',
          }}
        />
        <View className="mb-1 mt-3 min-h-[78px] justify-between">
          <View>
            <Text numberOfLines={2} className="text-[12px] font-bold">
              {props?.item?.title}
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
        <CustomButton.Secondary
          label="Add to cart"
          containerClassname="border-[#0F3D30] h-[29px] rounded-[4px]"
          textClassName="text-[#0F3D30] font-regular text-[12px]"
          onPress={() => AddToCart(props?.item?.id)}
        />
      </View>
    </Pressable>
  );
}

export default ProductItem;
