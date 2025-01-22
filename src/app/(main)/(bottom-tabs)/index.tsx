import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiText, MotiView } from 'moti';
import React from 'react';
import { Animated, FlatList } from 'react-native';
import { twMerge } from 'tailwind-merge';

import _Carousel from '@/components/general/carousel';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import ViewAll from '@/components/general/view-all';
import FilterModal from '@/components/products/filter-modal';
import LocationModal from '@/components/products/location-modal';
import ProductCarousel from '@/components/products/product-carousel';
import {
  colors,
  Image,
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
        className="absolute inset-x-0 top-0 z-50 bg-white pb-2"
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
            <View className="mt-2 flex-row items-center justify-between">
              {opts.map((e, i) => (
                <Pressable
                  key={i.toString()}
                  onPress={e.onPress}
                  className="flex-row items-center gap-2 rounded-full bg-[#F7F7F7] px-6 py-3"
                >
                  {e.icon}
                  <Text className="color-[#1212127B2]">{e.name}</Text>
                </Pressable>
              ))}
            </View>
            <AdsBanner imgs={imgs} />
            {FeaturedBrands(dummyProducts)}
          </Container.Box>
          <Container.Box containerClassName="bg-[#F7F7F7] pb-5">
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

const AdsBanner = ({ imgs }: { imgs: any }) => {
  const [index, setIndex] = React.useState<0 | 1>(0);
  const defaultBanners = [
    {
      label: 'Easy Shopping',
      desc: 'Order groceries effortlessly, get them delivered right to your door',
      bgColor: '#FFF5E1',
      id: 'jsjiwi',
    },
    {
      label: 'Daily Delights',
      desc: 'Get everything you need for your daily meals right at your fingertips.',
      bgColor: '#C9FCE9',
      id: 'sjejejj',
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (index === 0) {
        setIndex(1);
      } else {
        setIndex(0);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [index]);
  return !Boolean(imgs.length) ? (
    <_Carousel data={imgs || []} />
  ) : (
    <>
      <AnimatePresence>
        <MotiView
          from={{ backgroundColor: defaultBanners[index].bgColor }}
          animate={{ backgroundColor: defaultBanners[index].bgColor }}
          transition={{ type: 'timing', duration: 650 }}
          className="mt-5 h-[130px] w-full flex-row items-center overflow-hidden rounded-[13px] p-5"
        >
          <View className="h-full w-3/5 justify-between">
            <View>
              <MotiText className="text-[16px] font-bold">
                {defaultBanners[index].label}
              </MotiText>
              <Text className="mt-1 text-[12px] opacity-75">
                {defaultBanners[index].desc}
              </Text>
            </View>
            <CustomButton
              label="SHOP NOW"
              containerClassname="h-[27px] rounded-full mb-0 text-[12px]"
              textClassName="text-[12px]"
            />
          </View>

          <Image
            source={require('../../../../assets/images/banner-icon.png')}
            className="absolute right-0 size-[128px]"
          />
        </MotiView>
      </AnimatePresence>
      <View className="mt-2 flex-row gap-2 self-center">
        {defaultBanners.map((e, i) => (
          <View
            key={e.id}
            className={twMerge(
              'h-[2px] w-14 ',
              i === index ? 'bg-black' : 'bg-[#030C0A1F]'
            )}
          />
        ))}
      </View>
    </>
  );
};

const FeaturedBrands = (dummyProducts: any[]) => {
  const { push } = useRouter();

  return (
    <View>
      <ViewAll
        title={'Featured Stores'}
        onPress={() => push('/all-brands')}
        seeAllBg="#F7F7F7"
      />
      <FlatList
        data={dummyProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="my-5"
        keyExtractor={(e) => e.id}
        renderItem={() => (
          <View className="mr-5 items-center justify-center ">
            <View className="size-[58px] overflow-hidden rounded-full bg-[#F7F7F7]">
              <Image
                source={{
                  uri: 'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
                }}
                className="size-full rounded-full object-contain"
              />
            </View>
            <Text className="mt-2 text-[12px]">20 items</Text>
          </View>
        )}
      />
    </View>
  );
};
