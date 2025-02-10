import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated } from 'react-native';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { AdsBanner } from '@/components/home/ads-banner';
import { FeaturedBrands } from '@/components/home/featured-brands';
import FilterModal from '@/components/products/filter-modal';
import LocationModal from '@/components/products/location-modal';
import ProductCarousel from '@/components/products/product-carousel';
import {
  colors,
  Pressable,
  ScrollView,
  Text,
  useModal,
  View,
} from '@/components/ui';
import useScrollBehavior from '@/lib/hooks/general/use-scroll-behavior';

import dummyProducts from '../../../lib/dummy';
const imgs = [
  {
    id: 1,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 2,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 3,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 4,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 5,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
];

// eslint-disable-next-line max-lines-per-function
export default function Home() {
  // const hasWalkthrough = false;
  // if (!hasWalkthrough) {
  //   return <Redirect href="/walkthrough" />;
  // }
  // const [_, setIsFirstTime] = useIsFirstTime();
  // setIsFirstTime(true);

  const { push } = useRouter();
  const { present, ref, dismiss } = useModal();
  const {
    present: locationPresent,
    ref: locationRef,
    dismiss: locationDismiss,
  } = useModal();

  const { headerTranslateY, onScroll } = useScrollBehavior();

  const notificationUnread = false;
  const opts = [
    {
      name: 'Filter',
      icon: <Ionicons name="filter-sharp" size={20} color="#12121270" />,
      onPress: present,
    },
    {
      name: 'Saved item',
      icon: <Octicons name="heart" size={20} color="#12121270" />,
      onPress: () => {},
    },
    {
      name: 'Deals',
      icon: <SimpleLineIcons name="energy" size={20} color="#12121270" />,
      onPress: () => {},
    },
  ];

  return (
    <>
      <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
        }}
        className="absolute inset-x-0 top-0 z-50 pb-2"
      >
        <Container.Box>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[14px] opacity-65">Delivery location</Text>
              <Pressable
                className="mt-2 flex-row items-center gap-2"
                onPress={locationPresent}
              >
                <FontAwesome6
                  name="location-dot"
                  size={18}
                  color={colors.primaryText}
                />
                <Text className="text-[14px] font-medium">
                  Ojo, abeokuta road
                </Text>
                <FontAwesome5 name="chevron-down" size={10} color="black" />
              </Pressable>
            </View>

            <Pressable
              className="rounded-full bg-[#F7F7F7] p-2"
              onPress={() => push('/notifications')}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={28}
                color="black"
              />

              {notificationUnread && (
                <Text className="absolute right-3 top-1 text-[16px] color-[#E84343]">
                  ●
                </Text>
              )}
            </Pressable>
          </View>
        </Container.Box>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        <Container.Page className="mt-16 px-0">
          <Container.Box>
            <CustomInput
              isSearch
              placeholder="Search for a product..."
              onPress={() => push('/search')}
            />
            <View className="mt-2 flex-row items-center justify-between gap-1">
              {opts.map((e, i) => (
                <Pressable
                  key={i.toString()}
                  onPress={e.onPress}
                  className="flex-row items-center gap-2 rounded-full bg-[#F7F7F7] px-5 py-3"
                >
                  {e.icon}
                  <Text className="dark:text-[#121227B2]">{e.name}</Text>
                </Pressable>
              ))}
            </View>
            <AdsBanner imgs={imgs} />
            {FeaturedBrands(dummyProducts)}
          </Container.Box>
          <Container.Box containerClassName="bg-[#F7F7F7] dark:bg-[#282828] pb-5">
            <ProductCarousel
              items={dummyProducts}
              title={'New Arrivals'}
              isLoading={false}
            />
            <ProductCarousel
              items={dummyProducts}
              title={'Trending Products'}
              isLoading={false}
            />
          </Container.Box>
        </Container.Page>
        <FilterModal ref={ref} dismiss={dismiss} />
        <LocationModal ref={locationRef} dismiss={locationDismiss} />
      </ScrollView>
    </>
  );
}
