import React from 'react';

import { Pressable, Text, View } from '../ui';
type Props = {
  title: string;
  onPress: () => void;
  seeAllBg?: string;
};

function ViewAll(props: Props) {
  return (
    <View className="mt-5 flex-row items-center justify-between">
      <Text className="text-[18px] font-bold">{props.title}</Text>
      <Pressable
        onPress={props.onPress}
        className="flex-row items-center py-1 pl-5"
      >
        <Text
          className="rounded-full bg-[#FFFFFF] p-2 px-4 text-[16px] font-medium dark:text-black"
          style={{ backgroundColor: props.seeAllBg || '#FFFFFF' }}
        >
          See all
        </Text>
      </Pressable>
    </View>
  );
}

export default ViewAll;
