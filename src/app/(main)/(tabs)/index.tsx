import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback } from 'react';
import { Animated, FlatList, RefreshControl } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { queryClient, QueryKey } from '@/api';
import { useGetCategories } from '@/api/product/use-get-categories';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import AdsHeader from '@/components/home/ads-header';
import FeaturedBrands from '@/components/home/featured-brands';
// import { FeaturedBrands } from '@/components/home/featured-brands';
import FilterModal from '@/components/products/filter-modal';
import LocationModal from '@/components/products/location-modal';
import ProductCarousel from '@/components/products/product-carousel';
import { colors, Pressable, Text, useModal, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { UserType } from '@/lib/constants';
import useScrollBehavior from '@/lib/hooks/general/use-scroll-behavior';

// const imgs = [
//   {
//     id: 1,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 2,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 3,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 4,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 5,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
// ];

// eslint-disable-next-line max-lines-per-function
export default function Home() {
  // const hasWalkthrough = false;
  // if (!hasWalkthrough) {
  //   return <Redirect href="/walkthrough" />;
  // }
  // const [_, setIsFirstTime] = useIsFirstTime();
  // setIsFirstTime(true);

  const { token } = useAuth();

  // console.log('🚀 ~ file: index.tsx:95 ~ products:', products);

  const { push } = useRouter();
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();

  const { data } = useGetCategories()();

  const [refreshing, setRefreshing] = React.useState(false);

  const categories = data?.data || [];
  // console.log('🚀 ~ Home ~ categories:', categories);
  // console.log('🚀 ~ file: index.tsx:95 ~ data:', data);
  // const { data } = useGetUser();
  // const isBusiness = user?.type === UserType.Business;
  const { present, ref, dismiss } = useModal();
  const {
    present: locationPresent,
    ref: locationRef,
    dismiss: locationDismiss,
  } = useModal();

  const phoneNumberAvailable = Boolean(user?.phoneNumber);
  const detailsProvided = () => {
    if (user?.type === UserType.Business) {
      return Boolean(user?.businessProfile);
    }
    if (user?.type === UserType.Individual) {
      return Boolean(
        user?.profile?.fullName && user?.profile?.address && user?.profile
      );
    }
    return false;
  };
  const preferencesProvided = false;

  const currentStep = () => {
    if (phoneNumberAvailable && detailsProvided() && preferencesProvided) {
      return;
    }
    if (detailsProvided()) {
      return 2;
    }
    if (phoneNumberAvailable) {
      return 1;
    }
    return 1;
  };

  const step = currentStep();
  // console.log('🚀 ~ file: index.tsx:126 ~ step:', step);

  // const [completeIndex] = React.useState<number | undefined>(step);
  const { onScroll, scrollOffset } = useScrollBehavior();

  const opts = [
    {
      name: 'Filter',
      icon: (
        <Ionicons
          name="filter-sharp"
          size={20}
          color={colorScheme === 'dark' ? 'white' : '#12121270'}
        />
      ),
      onPress: present,
    },
    {
      name: 'Saved item',
      icon: (
        <Octicons
          name="heart"
          size={20}
          color={colorScheme === 'dark' ? 'white' : '#12121270'}
        />
      ),
      onPress: () => {},
    },
    {
      name: 'Deals',
      icon: (
        <SimpleLineIcons
          name="energy"
          size={20}
          color={colorScheme === 'dark' ? 'white' : '#12121270'}
        />
      ),
      onPress: () => {},
    },
  ];

  const stickyHeaderHeight = scrollOffset
    ? scrollOffset.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 30], // Adjust this value for desired spacing
        extrapolate: 'clamp',
      })
    : new Animated.Value(0);

  const handleRefresh = useCallback(async () => {
    try {
      // console.log('🚀 ~ Home ~ handleRefresh triggered');
      setRefreshing(true);
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.CATEGORIES],
      });
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === QueryKey.PRODUCTS;
        },
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKey.MANUFACTURERS],
      });

      await queryClient.fetchQuery({
        queryKey: [QueryKey.CATEGORIES],
      });
      await queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === QueryKey.PRODUCTS;
        },
      });
      await queryClient.fetchQuery({
        queryKey: [QueryKey.MANUFACTURERS],
      });
      // setTimeout(() => {
      //   setRefreshing(false);
      // }, 2000);
    } catch (error) {
      console.log('🚀 ~ handleRefresh ~ error:', error);
      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // console.log('🚀 ~ Home ~ stickyHeaderHeight:', stickyHeaderHeight);

  // const stickyHeaderHeight = scroll
  //   ? scroll?.interpolate({
  //       inputRange: [0, 50],
  //       outputRange: [0, 12], // Adjust this value for desired spacing
  //       extrapolate: 'clamp',
  //     })
  //   : new Animated.Value(0);

  // useEffect(() => {
  // StatusBar.setHidden(false, 'slide');
  // StatusBar.setBarStyle('dark-content');
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* <SafeAreaView edges={['top']} /> */}

      {/* <StatusBar barStyle={'light-content'} backgroundColor={'green'} /> */}
      {/* <Animated.View
        style={{
          transform: [{ translateY: headerTranslateY }],
        }}
        className="absolute inset-x-0 top-0 z-50 pb-2 dark:bg-black"
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
        <Animated.View
          style={[{ transform: [{ translateY }] }]}
          className={'absolute inset-x-0 top-0'}
        >
          <Container.Box>
            <CustomInput
              isSearch
              placeholder="Search for a product..."
              onPress={() => push('/search')}
            />
          </Container.Box>
        </Animated.View>
      </Animated.View> */}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // bounces={false}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryText}
          />
        }
        // className={'bg-white dark:bg-[#282828]'}
      >
        <AdsHeader scroll={scrollOffset} locationPresent={locationPresent} />

        <Container.Box>
          <Animated.View
            style={{
              paddingTop: stickyHeaderHeight,
            }}
          >
            <CustomInput
              isSearch
              placeholder="Search for a product..."
              onPress={() => push('/search')}
              // style={{
              //   elevation: 2,
              //   shadowRadius: 1,
              //   shadowColor: '#000',
              //   shadowOffset: { width: 0, height: 0 },
              //   shadowOpacity: 0.2,
              // }}
              containerClass="shadow-sm overflow-hidden rounded-full"
            />
          </Animated.View>
        </Container.Box>

        <Container.Page className="px-0 dark:bg-black">
          <Container.Box>
            {token && Boolean(step) && (
              <Pressable
                onPress={() => {
                  push('/complete-profile');
                }}
                className="my-3 w-full flex-row items-center justify-between rounded-xl border border-[#E9EAEC] p-4"
              >
                <View className="w-[90%] gap-5">
                  <Text className=" text-[18px] font-bold">
                    Complete your account setup, shall we?
                  </Text>
                  <View>
                    <View className="flex-row gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <View
                          key={i.toString()}
                          className={twMerge(
                            'h-1 w-20 rounded-full bg-[#EC9F0140]',
                            i + 1 <= Number(step) && 'bg-primaryText'
                          )}
                        />
                      ))}
                    </View>
                    <Text className="mt-2 opacity-70">
                      Few steps remaining to complete
                    </Text>
                  </View>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={25}
                  color={colorScheme === 'dark' ? '#fff' : 'black'}
                />
              </Pressable>
            )}

            <View className=" flex-row items-center justify-between gap-1">
              {opts.map((e, i) => (
                <Pressable
                  key={i.toString()}
                  onPress={e.onPress}
                  className="flex-row items-center gap-2 rounded-full bg-[#F7F7F7] px-6 py-3 dark:bg-[#282828] "
                >
                  {e.icon}
                  <Text className="text-[#121227B2] dark:text-[#fff]">
                    {e.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            {/* <AdsBanner imgs={imgs} /> */}
            <FeaturedBrands />
            {/* {FeaturedBrands(dummyProducts)} */}
          </Container.Box>
          <Container.Box containerClassName="bg-[#F7F7F7] dark:bg-[#282828] pb-5">
            <ProductCarousel title={'New Arrivals'} type="new" />
            <ProductCarousel title={'Trending Products'} type="trending" />
          </Container.Box>
          {categories.length && (
            <Container.Box containerClassName="py-3">
              <Text className="mb-2 text-[18px] font-bold">
                Store Categories
              </Text>
              <View className="mt-3 gap-2">
                <FlatList
                  data={categories}
                  renderItem={({ item }) => (
                    <Pressable
                      className="mb-3 w-[49%] rounded-lg bg-[#F7F7F7] p-2 py-3 dark:bg-[#282828]"
                      onPress={() => push(`/all-products?category=${item?.id}`)}
                    >
                      <Text>{item?.name}</Text>
                    </Pressable>
                  )}
                  scrollEnabled={false}
                  keyExtractor={(_, i) => i.toString()}
                  numColumns={2}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                />
              </View>
            </Container.Box>
          )}
        </Container.Page>
        <FilterModal ref={ref} dismiss={dismiss} />
        <LocationModal ref={locationRef} dismiss={locationDismiss} />
      </Animated.ScrollView>
    </View>
  );
}
