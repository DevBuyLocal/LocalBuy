import React from 'react';

import { CartSelector, useCart } from '@/lib/cart';

import { Pressable, Text, View } from '../ui';

type QuantitySelectProps = {
  itemId: string;
};

function QuantitySelect(props: QuantitySelectProps) {
  const { increaseQuantity, decreaseQuantity, products_in_cart } =
    useCart(CartSelector);

  const foundItem = products_in_cart.find((item) => item?.id === props?.itemId);
  if (!foundItem) return null;

  return (
    <View className="flex-row items-center justify-between overflow-hidden rounded-[4px] border">
      <Pressable
        onPress={() => decreaseQuantity(props.itemId)}
        className="px-[25px]"
      >
        <Text className="text-[20px] font-bold">-</Text>
      </Pressable>
      <Text className="text-[20px] font-medium">
        {foundItem?.quantity || 0}
      </Text>
      <Pressable
        onPress={() => increaseQuantity(props.itemId)}
        className="px-[25px] py-px"
      >
        <Text className="text-[20px] font-bold">+</Text>
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
