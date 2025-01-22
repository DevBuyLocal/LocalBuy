import { Entypo } from '@expo/vector-icons';
import { View } from 'moti';
import React from 'react';
import { FlatList } from 'react-native';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { Image, Text } from '@/components/ui';

function AllBrands() {
  const [search, setSearch] = React.useState<string>('');

  const BrandItem = ({ item }: any) => (
    <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
      <View className="flex-row items-center justify-center gap-5">
        <Image
          source={{
            uri: 'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
          }}
          className="size-[60px] rounded-full"
        />
        <Text className="text-[16px] opacity-75">{item?.name} Brand name</Text>
      </View>

      <Entypo name="chevron-right" size={18} color="black" />
    </View>
  );
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
            data={Array.from({ length: 10 })}
            renderItem={({ item }) => <BrandItem item={item} />}
          />
        </View>
      </Container.Box>
    </Container.Page>
  );
}

export default AllBrands;
