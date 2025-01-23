import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

import ViewAll from '@/components/general/view-all';
import { Image, Text, View } from '@/components/ui';

export const FeaturedBrands = (dummyProducts: any[]) => {
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
