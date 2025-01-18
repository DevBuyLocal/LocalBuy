import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import { Pressable, Text, View } from '@/components/ui';
import { useUtility, UtilitySelector } from '@/lib/utility';

import dummyProducts from '../../lib/dummy';

function Search() {
  const [search, setSearch] = React.useState<string>('');
  const { addToRecent, recent_search, clearRecent } =
    useUtility(UtilitySelector);
  console.log('🚀 ~ Search ~ recent_search:', recent_search);
  const resultAvailable = Boolean(dummyProducts.length && search);

  return (
    <Container.Page
      showHeader
      showCart
      headerComponent={
        <View className="w-[70%]">
          <CustomInput
            isSearch
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            autoFocus
            numberOfLines={1}
            onEndEditing={() => {
              addToRecent(search);
            }}
          />
        </View>
      }
    >
      {Boolean(!resultAvailable && recent_search.length) && (
        <Container.Box containerClassName="flex-1">
          <Text className="my-3 text-[16px] font-medium">Recently viewed</Text>

          {recent_search.map((e, i) => (
            <Text
              key={i.toString()}
              className="my-2 opacity-75"
              numberOfLines={2}
            >
              {e}
            </Text>
          ))}
          <Text
            className="mt-3 self-end text-[16px] underline"
            onPress={clearRecent}
          >
            Clear recent
          </Text>
        </Container.Box>
      )}
      {resultAvailable && (
        <Container.Box containerClassName="flex-1 bg-[#F7F7F7]">
          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-[18px] font-medium">65 results</Text>
            <Pressable className=" flex-row items-center justify-between gap-2">
              <Ionicons name="filter-sharp" size={20} color="#black" />
              <Text className="opacity-65">Filter</Text>
            </Pressable>
          </View>
        </Container.Box>
      )}
    </Container.Page>
  );
}

export default Search;
