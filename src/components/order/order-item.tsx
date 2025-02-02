import { Entypo } from '@expo/vector-icons';
import React from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Image, Pressable, Text, View } from '../ui';

type Props = {
  item: any;
  handleDelete: () => void;
  onPress?: () => void;
};

function OrderItem({ item, handleDelete, onPress }: Props) {
  const leftSwipe = () => {
    return (
      <Pressable onPress={handleDelete}>
        <View className="h-full w-[70px] items-center justify-center rounded-lg bg-red-500 p-2">
          <Entypo name="trash" color={'white'} size={30} />
        </View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      overshootFriction={8}
      renderRightActions={leftSwipe}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between border-b border-gray-200  py-4"
      >
        <View className="flex-row items-center gap-5">
          <Image
            source={{
              uri: 'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
            }}
            className="h-[75px] w-[70px] rounded-lg bg-[#F7F7F7]"
          />
          <View className="h-[75px] justify-between ">
            <Text numberOfLines={2} className="w-[70%] font-medium">
              {item?.name}Mr. Rice. Foreign long rice (50kg)
            </Text>
            <Text className="opacity-70">Upcoming: Sat, Dec 31</Text>
          </View>
        </View>

        <Text className="underline color-primaryText">Edit</Text>
      </Pressable>
    </Swipeable>
  );
}

export default OrderItem;
