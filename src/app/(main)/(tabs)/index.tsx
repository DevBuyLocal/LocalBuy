import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  type ScrollView,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

import { queryClient, QueryKey, useGetUser } from '@/api';
import { useGetNotifications } from '@/api/notifications/use-get-notifications';
import { useGetCategories } from '@/api/product/use-get-categories';
import { useGetSavedProducts } from '@/api/product/use-get-saved-products';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import AdsHeader from '@/components/home/ads-header';
import DealsSection from '@/components/home/deals-section';
import FeaturedBrands from '@/components/home/featured-brands';
import SavedItems from '@/components/home/saved-items';
import FilterModal from '@/components/products/filter-modal';
import LocationModal from '@/components/products/location-modal';
import ProductCarousel from '@/components/products/product-carousel';
import { colors, Pressable, Text, useModal, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { UserType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';
import useScrollBehavior from '@/lib/hooks/general/use-scroll-behavior';

// eslint-disable-next-line max-lines-per-function
export default function Home() {
  // const hasWalkthrough = false;
  // if (!hasWalkthrough) {
  //   return <Redirect href="/walkthrough" />;
  // }
  // const [_, setIsFirstTime] = useIsFirstTime();
  // setIsFirstTime(true);

  const { token } = useAuth();

  const { push } = useRouter();
  const scrollViewRef = React.useRef<ScrollView>(null);

  const { data: user, refetch } = useGetUser();

  const { colorScheme } = useColorScheme();
  const [showSaved, setShowSaved] = React.useState(false);

  const { data } = useGetCategories()();
  const { data: savedProducts } = useGetSavedProducts()();
  const { data: notifications } = useGetNotifications()();

  const [refreshing, setRefreshing] = React.useState(false);

  const categories = data?.data || [];

  const { present, ref, dismiss } = useModal();
  const { setSuccess } = useLoader({
    showLoadingPage: false,
  });
  const [showLocationModal, setShowLocationModal] = React.useState(false);

  const handleAddressSaved = (address: string) => {
    console.log('📍 Address saved from homepage:', address);
    setShowLocationModal(false);
    // Refetch user data to update the address display
    refetch();
  };

  const phoneNumberAvailable = Boolean(user?.profile?.deliveryPhone);
  const detailsProvided = () => {
    if (user?.type === UserType.Business) {
      return Boolean(
        user?.profile?.businessPhone && user?.profile?.businessName
      );
    }
    if (user?.type === UserType.Individual) {
      return Boolean(user?.profile?.fullName && user?.profile?.deliveryPhone);
    }
    return true;
  };
  const preferencesProvided = true;

  const currentStep = () => {
    if (detailsProvided() && preferencesProvided) {
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
          color={
            colorScheme === 'dark' ? 'white' : showSaved ? '#fff' : `#12121270`
          }
        />
      ),
      onPress: () => {
        if (!savedProducts?.savedProducts?.length) {
          setSuccess('No saved items');
        } else {
          setShowSaved(!showSaved);
        }
      },
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
      onPress: () => {
        // to scroll to the Deals section using the id of the section
        scrollViewRef?.current?.scrollTo({
          y: 1800,
          animated: true,
        });
      },
    },
  ];

  const stickyHeaderHeight = scrollOffset
    ? scrollOffset.interpolate({
        inputRange: [0, 20],
        outputRange: [0, 0], // Adjust this value for desired spacing
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

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryText}
          />
        }
      >
                    <AdsHeader
              scroll={scrollOffset}
              locationPresent={() => setShowLocationModal(true)}
              notifications={notifications}
              user={user}
            />

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
                  className={twMerge(
                    'flex-row items-center gap-2 rounded-full bg-[#F7F7F7] px-6 py-3 dark:bg-[#282828] ',
                    showSaved && i === 1
                      ? 'bg-primaryText'
                      : 'bg-[#F7F7F7] dark:bg-[#282828]'
                  )}
                >
                  {e.icon}
                  <Text
                    className={twMerge(
                      'text-[#121227B2] dark:text-[#fff]',
                      showSaved && i === 1 && 'text-white'
                    )}
                  >
                    {e.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            {showSaved && <SavedItems savedProducts={savedProducts} />}
            <FeaturedBrands />
          </Container.Box>
          <Container.Box containerClassName="bg-[#F7F7F7] dark:bg-[#282828] pb-5">
            <ProductCarousel title={'New Arrivals'} type="new" />
            <ProductCarousel title={'Trending Products'} type="trending" />
            <ProductCarousel title={'Popular Groceries'} type="popular" />
          </Container.Box>
          <DealsSection />

          {Boolean(categories.length) && (
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
        <LocationModal
          visible={showLocationModal}
          onDismiss={() => setShowLocationModal(false)}
          onAddressSaved={handleAddressSaved}
        />
      </Animated.ScrollView>
    </View>
  );
}
