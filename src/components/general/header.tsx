import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { type GestureResponderEvent } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';

export type HeaderProps = {
  backPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  headerTitle?: string | undefined;
  headerComponent?: JSX.Element;
};

function Header(props: HeaderProps) {
  const { back } = useRouter();
  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
      }}
      className="h-20 w-full flex-row bg-white px-5"
    >
      <Pressable
        onPress={props.backPress || back}
        className="absolute left-5 top-1 z-10 my-3 size-[45px] items-center justify-center rounded-full bg-[#EFF2F7]"
      >
        <Ionicons name="arrow-back-sharp" size={30} className="color-black" />
      </Pressable>
      <View className="w-full items-center justify-center ">
        {props.headerTitle ? (
          <Text className="text-[16px] font-bold">{props.headerTitle}</Text>
        ) : (
          props.headerComponent
        )}
      </View>
    </View>
  );
}

export default Header;
