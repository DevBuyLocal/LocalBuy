import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';

import { useGetManufacturers } from '@/api/manufacturers';
import { type TSingleManufacturers } from '@/api/manufacturers/types';
import ViewAll from '@/components/general/view-all';
import { Image, Text, View } from '@/components/ui';

const Item = ({ e }: { e: TSingleManufacturers }) => {
  const [imgSrc, setImgSrc] = React.useState(e.logo ? e.logo : null);

  return (
    <View className="mt-3 h-[124px] w-[112px] rounded-[12px] bg-[#F7f7f7] p-3 dark:bg-[#282828]">
      <View className="size-[45px] overflow-hidden rounded-full bg-[#F7F7F7]">
        <Image
          source={
            imgSrc
              ? { uri: imgSrc }
              : require('../../../assets/images/img-p-holder.png')
          }
          onError={() => {
            setImgSrc(null);
          }}
          className="size-full rounded-full bg-white"
          contentFit="contain"
          style={{
            tintColor: imgSrc ? undefined : '#D5D5D5',
          }}
        />
      </View>
      <Text className="mt-3 text-[12px] font-bold" numberOfLines={2}>
        {e?.name}
      </Text>
    </View>
  );
};

const FeaturedBrands = () => {
  const { push } = useRouter();
  const { data } = useGetManufacturers({ limit: 10, page: 1 })();
  const brands = React.useMemo(() => data?.pages[0]?.data || [], [data]);
  
  // Calculate responsive layout for 3 items per row
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = 112; // Width of each brand item
  const horizontalPadding = 20; // Padding from container
  const availableWidth = screenWidth - (horizontalPadding * 2);
  const itemsPerRow = 3; // Fixed to 3 items per row
  const gap = (availableWidth - (itemsPerRow * itemWidth)) / (itemsPerRow - 1);
  
  // Debug logging for layout calculations
  console.log('🔍 FeaturedBrands Layout Debug:', {
    screenWidth,
    availableWidth,
    itemsPerRow,
    gap,
    itemWidth,
    totalBrands: brands.length,
    displayedBrands: Math.min(brands.length, 6)
  });
  
  // Debug: Log what we're getting
  console.log('🔍 FeaturedBrands Data:', {
    hasData: !!data,
    dataPages: data?.pages,
    firstPageData: data?.pages?.[0]?.data,
    brandsLength: brands.length,
    brands: brands
  });
  
  // Always show the section, even if no brands
  return (
    <View>
      <ViewAll
        title={'Stores for you'}
        onPress={() => push('/all-brands')}
        seeAllBg="#F7F7F7"
      />

      {brands.length > 0 ? (
        <View className="mb-5 flex-row flex-wrap">
          {brands.slice(0, 6).map((e, i) => (
            <View 
              key={i.toString()} 
              style={{ 
                marginBottom: 12,
                marginRight: (i + 1) % itemsPerRow !== 0 ? gap : 0
              }}
            >
              <Item e={e} />
            </View>
          ))}
        </View>
      ) : (
        <View className="mb-5 p-4">
          <Text className="text-center text-gray-500">
            No stores available at the moment.
          </Text>
        </View>
      )}
    </View>
  );
};

export default FeaturedBrands;
