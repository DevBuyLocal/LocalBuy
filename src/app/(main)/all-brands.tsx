import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { useGetManufacturers } from '@/api/manufacturers';
import { type TSingleManufacturers } from '@/api/manufacturers/types';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { Image, Text } from '@/components/ui';

function AllBrands() {
  const [search, setSearch] = React.useState<string>('');
  const { push } = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetManufacturers({ limit: 20, page: 1 })();
  const brands = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.data || []);
  }, [data]);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const BrandItem = React.memo(({ item }: { item: TSingleManufacturers }) => {
    const [imgSrc, setImgSrc] = React.useState(item.logo ? item.logo : null);

    const handlePress = React.useCallback(() => {
      console.log('Brand clicked:', item.name, 'ID:', item.id);
      push(`/all-products?brand=${item.id}&title=${encodeURIComponent(item.name)}`);
    }, [item.id, item.name, push]);

    return (
      <Pressable
        className="flex-row items-center justify-between border-b border-gray-200 p-4"
        onPress={handlePress}
        style={{ minHeight: 80 }}
      >
        <View className="flex-row items-center justify-center gap-5">
          <Image
            source={
              imgSrc
                ? { uri: imgSrc }
                : require('../../../assets/images/img-p-holder.png')
            }
            onError={() => {
              setImgSrc(null);
            }}
            style={{
              tintColor: imgSrc ? undefined : '#D5D5D5',
            }}
            className="size-[60px] rounded-full bg-gray-50"
            contentFit="contain"
          />
          <Text className="text-[16px] opacity-75">
            {item?.name}
          </Text>
        </View>

        <Entypo name="chevron-right" size={18} color="black" />
      </Pressable>
    );
  });
  return (
    <Container.Page showHeader headerTitle="All brands">
      <Container.Box>
        <View className="w-full">
          <CustomInput
            isSearch
            placeholder="Enter brand name..."
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={filteredBrands}
            renderItem={({ item }) => <BrandItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                console.log('Fetching next page...');
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => 
              isFetchingNextPage ? (
                <View className="p-4">
                  <Text className="text-center text-gray-500">Loading more brands...</Text>
                </View>
              ) : null
            }
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </View>
      </Container.Box>
    </Container.Page>
  );
}

export default AllBrands;
