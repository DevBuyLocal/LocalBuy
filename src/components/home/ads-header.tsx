import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '@/lib';

import { Image, Text, WIDTH } from '../ui';

const IMAGE_SOURCES = [
  require('../../../assets/images/home-icons/hm2.jpeg'),
  require('../../../assets/images/home-icons/hm1.jpeg'),
  require('../../../assets/images/home-icons/hm3.jpeg'),
];

interface AdsHeaderProps {
  scroll?: Animated.Value;
  height?: number;
  locationPresent: (data?: any) => void;
  notifications: any;
  user: any;
}

const AdsHeader = ({
  scroll,
  height = 300,
  locationPresent,
  notifications,
  user,
}: AdsHeaderProps) => {
  const { push } = useRouter();
  const { token } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollHeight = height;

  // Memoize scale interpolation
  const scaleImg = React.useMemo(() => {
    if (!scroll) return new Animated.Value(1);
    return scroll.interpolate({
      inputRange: [-scrollHeight, 0, scrollHeight],
      outputRange: [0, 1, 0.8],
      extrapolate: 'clamp',
    });
  }, [scroll, scrollHeight]);

  // Memoize function to prevent re-renders
  const handleSnapToItem = React.useCallback((index: number) => {
    setCurrentIndex((prev) => (prev === index ? prev : index) % 3);
  }, []);

  // Memoize renderItem
  const renderItem = React.useCallback(
    ({ index }: { index: number }) => (
      <View className="size-full" key={index.toString()}>
        <Animated.View
          className="my-10 flex-row self-center"
          style={{ transform: [{ scale: scaleImg }] }}
        >
          {IMAGE_SOURCES.map((src, imgIndex) => {
            return (
              <Image
                key={imgIndex}
                className={twMerge(
                  `size-[122px] rounded-[16px] object-cover`,
                  imgIndex === 0
                    ? 'translate-x-8 translate-y-5 -rotate-12'
                    : imgIndex === 2
                      ? '-translate-x-8 translate-y-5 rotate-12'
                      : 'z-10'
                )}
                source={src}
              />
            );
          })}
        </Animated.View>

        <View className="mt-10 items-center self-center">
          <Text className="text-center text-[23px] font-bold leading-[30px] text-white">
            Experience Smarter{`\n`}Shopping with{' '}
            <Text className="text-[23px] font-bold leading-[30px] text-primaryText">
              BuyLocal
            </Text>
          </Text>
          <Text className="mt-5 text-center text-[18px] font-normal leading-[18px] text-white">
            Your one-stop food shop!
          </Text>
        </View>
      </View>
    ),
    [scaleImg]
  );

  const notificationUnread = Boolean(
    notifications?.data.filter((e: any) => !e?.isRead).length > 0
  );

  return (
    <View className="w-full overflow-hidden bg-[#0F3D30] p-5">
      <View className="flex-row items-center justify-between">
        {token && (
          <View>
            <Text className="mb-1 w-[70px]  rounded-sm bg-[#FFFFFF1A] px-2 text-[14px] text-white">
              Address
            </Text>
            <Pressable
              className=" flex-row items-center gap-2"
              onPress={locationPresent}
            >
              <Text
                className="max-w-[90%] text-[14px] font-medium text-white"
                numberOfLines={1}
              >
                {!user ? 'Loading...' : 
                  user?.defaultAddress?.addressLine1 || 
                  user?.profile?.address || 
                  user?.profile?.businessAddress || 
                  (user?.type === 'individual' ? 'Add delivery address' : 'Add business address')}
              </Text>
              <FontAwesome5 name="chevron-down" size={10} color="white" />
            </Pressable>
          </View>
        )}
        {token && (
          <Pressable
            className="rounded-full bg-[#FFFFFF1A] p-2"
            onPress={() => push('/notifications')}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color="white"
            />

            {notificationUnread && (
              <Text className="absolute right-3 top-1 text-[16px] color-[#E84343]">
                ●
              </Text>
            )}
          </Pressable>
        )}
      </View>

      <Carousel
        loop
        width={WIDTH * 0.911}
        height={WIDTH / 1.1}
        autoPlay={true}
        autoPlayInterval={3000}
        data={IMAGE_SOURCES}
        scrollAnimationDuration={1500}
        onSnapToItem={handleSnapToItem}
        onScrollStart={() => {}}
        renderItem={renderItem}
      />
      <View className="absolute bottom-5 flex-row self-center">
        {IMAGE_SOURCES.map((_, i) => (
          <View
            key={i}
            className="mx-1 h-[8px] rounded-full"
            style={{
              backgroundColor: currentIndex === i ? 'white' : '#ffffffa1',
              width: currentIndex === i ? 14 : 8,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default AdsHeader;
