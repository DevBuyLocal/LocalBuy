import React from 'react';
import { type ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { CartSelector, useCart } from '@/lib/cart';

import { Pressable, Text, View } from '../ui';

interface QuantitySelectProps extends Partial<ViewProps> {
  itemId: string;
  containerClass?: string | undefined;
  removeOnZero?: boolean;
}

function QuantitySelect(props: QuantitySelectProps) {
  const { increaseQuantity, decreaseQuantity, products_in_cart } =
    useCart(CartSelector);

  const foundItem = products_in_cart.find((item) => item?.id === props?.itemId);
  if (!foundItem) return null;

  return (
    <View
      className={twMerge(
        'flex-row items-center justify-between overflow-hidden rounded-[4px] px-4 py-1 border dark:border-[#fff]',
        props.containerClass
      )}
      {...props}
    >
      <Pressable
        onPress={() => decreaseQuantity(props.itemId, props.removeOnZero)}
        // className="px-[25px]"
      >
        <Text className="text-[20px] font-bold">-</Text>
      </Pressable>
      <Text className="text-[20px] font-medium text-black">
        {foundItem?.quantity || 0}
      </Text>
      <Pressable
        onPress={() => increaseQuantity(props.itemId)}
        // className="px-[25px] py-px"
      >
        <Text className="text-[20px] font-bold">+</Text>
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
