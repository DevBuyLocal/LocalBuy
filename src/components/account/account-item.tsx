import Entypo from '@expo/vector-icons/Entypo';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { type GestureResponderEvent, type PressableProps } from 'react-native';

import { Pressable, Text, View } from '../ui';

interface AccountItemProps extends Partial<PressableProps> {
  label: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  icon: React.JSX.Element;
  rightElement?: React.JSX.Element;
}

function AccountItem(props: AccountItemProps) {
  const { colorScheme } = useColorScheme();
  return (
    <Pressable
      className="flex-row items-center justify-between py-[20px]"
      onPress={props.onPress}
      {...props}
    >
      <View className="flex-row items-center gap-5">
        {props.icon}
        <Text className="text-[16px] color-[#121212]">{props.label}</Text>
      </View>
      {props.rightElement ? (
        props.rightElement
      ) : (
        <Entypo
          name="chevron-small-right"
          size={20}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      )}
    </Pressable>
  );
}

export default AccountItem;
