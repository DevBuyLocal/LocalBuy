import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { Image, SafeAreaView, Text, WIDTH } from '../ui';

export function AdsHeader({
  scroll,
  height = 300,
  locationPresent,
}: {
  scroll?: Animated.Value;
  image?: ImageSource;
  height?: number;
  locationPresent: (data?: any) => void;
}) {
  const scrollHeight = height;
  const { push } = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const scaleImg = scroll
    ? scroll.interpolate({
        inputRange: [-scrollHeight, 0, scrollHeight],
        outputRange: [0, 1, 0.8],
        extrapolate: 'clamp',
      })
    : new Animated.Value(0);

  const notificationUnread = false;

  return (
    <View className="w-full overflow-hidden bg-[#0F3D30] p-5">
      <SafeAreaView edges={['top']} />
      {/* <SafeAreaView edges={['top']} /> */}
      {/* {IS_IOS && <SafeAreaView edges={['top']} />} */}

      <View className="flex-row items-center justify-between">
        <View>
          <Text className="mb-1 w-[70px]  rounded-sm bg-[#FFFFFF1A] px-2 text-[14px] text-white">
            Address
          </Text>
          <Pressable
            className=" flex-row items-center gap-2"
            onPress={locationPresent}
          >
            <Text className="text-[14px] font-medium text-white">
              Ojo, abeokuta road
            </Text>
            <FontAwesome5 name="chevron-down" size={10} color="white" />
          </Pressable>
        </View>

        <Pressable
          className="rounded-full bg-[#FFFFFF1A] p-2"
          onPress={() => push('/notifications')}
        >
          <MaterialCommunityIcons name="bell-outline" size={28} color="white" />

          {notificationUnread && (
            <Text className="absolute right-3 top-1 text-[16px] color-[#E84343]">
              ●
            </Text>
          )}
        </Pressable>
      </View>

      <Carousel
        loop
        width={WIDTH * 0.911}
        height={WIDTH / 1.1}
        autoPlay={true}
        data={[1, 2, 3]}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ index }) => (
          <View key={index.toString()} className="size-full">
            <Animated.View
              className="my-10 flex-row self-center"
              style={{ transform: [{ scale: scaleImg }] }}
            >
              <Image
                className="size-[122px] translate-x-8 translate-y-5 -rotate-12 rounded-[16px] object-cover"
                source={require('../../../assets/images/home-icons/hm2.jpeg')}
              />
              <Image
                className="z-10 size-[122px] rounded-[16px] object-cover"
                source={require('../../../assets/images/home-icons/hm1.jpeg')}
              />
              <Image
                className="size-[122px] -translate-x-8 translate-y-5 rotate-12 rounded-[16px] object-cover"
                source={require('../../../assets/images/home-icons/hm3.jpeg')}
              />
            </Animated.View>
            <View className="mt-10  items-center self-center">
              <Text className="text-center text-[23px] font-bold leading-[30px] text-white">
                Experience Smarter{`\n`}Shopping with{' '}
                <Text className="text-[23px] font-bold leading-[30px] text-primaryText">
                  {' '}
                  BuyLocal
                </Text>
              </Text>

              <Text className="mt-5 text-center text-[18px] font-normal leading-[18px] text-white">
                Your one-stop food shop!
              </Text>
            </View>
          </View>
        )}
      />
      <View className="absolute bottom-10 flex-row self-center">
        {[1, 2, 3]?.map((e, i) => (
          <View
            key={i.toString()}
            className="mx-1 h-[8px] w-[14px] rounded-full "
            style={{
              backgroundColor: currentIndex === i ? 'white' : '#ffffffa1',
              width: currentIndex === i ? 14 : 8,
            }}
          />
        ))}
      </View>
    </View>
  );
}
