import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { type GestureResponderEvent } from 'react-native';

import { useGetCartItems } from '@/api/cart';
import { Pressable, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';

export type HeaderProps = {
  backPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  headerTitle?: string | undefined;
  headerComponent?: JSX.Element;
  showCart?: boolean;
  hideBackButton?: boolean;
  rightHeaderIcon?: JSX.Element;
};

function Header(props: HeaderProps) {
  const { back, push } = useRouter();
  const { token } = useAuth();
  const { total } = useCart(CartSelector);
  const { colorScheme } = useColorScheme();

  const { data } = useGetCartItems();

  const noInCart = token ? data?.items?.length : total;

  return (
    <View
      style={{
        shadowColor: colorScheme === 'dark' ? '#fff' : '#000000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.0,
        elevation: 1,
      }}
      className="h-20 w-full flex-row bg-[#FFFFFF] px-5 dark:bg-black"
    >
      {!props.hideBackButton && (
        <Pressable
          onPress={props.backPress || back}
          className="absolute left-5 top-2 z-10 my-3 size-[40px] items-center justify-center rounded-full bg-[#F7F7F7]"
        >
          <Ionicons name="arrow-back-sharp" size={24} className="color-black" />
        </Pressable>
      )}
      <View className="w-full items-center justify-center ">
        {props.headerComponent ? (
          props.headerComponent
        ) : (
          <View>
            <Text className="text-[16px] font-bold capitalize">
              {props.headerTitle}
            </Text>
          </View>
        )}
      </View>

      {props.showCart && (
        <Pressable
          onPress={() => push('/(bottom-tabs)/cart')}
          className="absolute right-5 top-2 z-10 my-3 size-[40px] items-center justify-center rounded-full bg-[#F7F7F7]"
        >
          <SimpleLineIcons name="basket" size={24} color="black" />
          <AnimatePresence>
            {Number(noInCart) && (
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ type: 'timing', duration: 350 }}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-[5px]"
              >
                <Text className=" text-[14px] font-bold text-white">
                  {noInCart}
                </Text>
              </MotiView>
            )}
          </AnimatePresence>
        </Pressable>
      )}

      {Boolean(props.rightHeaderIcon && !props.showCart) &&
        props.rightHeaderIcon}
    </View>
  );
}

export default Header;
