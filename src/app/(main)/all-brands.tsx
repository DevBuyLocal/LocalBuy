import { Entypo } from '@expo/vector-icons';
import { View } from 'moti';
import React from 'react';
import { FlatList } from 'react-native';

import { useGetManufacturers } from '@/api/manufacturers';
import { type TSingleManufacturers } from '@/api/manufacturers/types';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { Image, Text } from '@/components/ui';

function AllBrands() {
  const [search, setSearch] = React.useState<string>('');

  const { data } = useGetManufacturers({ limit: 10, page: 1 })();
  const brands = React.useMemo(() => data?.pages[0]?.data || [], [data]);

  const BrandItem = ({ item }: { item: TSingleManufacturers }) => {
    const [imgSrc, setImgSrc] = React.useState(item.logo ? item.logo : null);

    return (
      <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
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
            {item?.name} Brand name
          </Text>
        </View>

        <Entypo name="chevron-right" size={18} color="black" />
      </View>
    );
  };
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
            data={brands}
            renderItem={({ item }) => <BrandItem item={item} />}
          />
        </View>
      </Container.Box>
    </Container.Page>
  );
}

export default AllBrands;
