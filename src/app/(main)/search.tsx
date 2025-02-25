import Ionicons from '@expo/vector-icons/Ionicons';
import debounce from 'lodash.debounce';
import React from 'react';

import { useGetProducts } from '@/api';
import { useSearchProducts } from '@/api/product/use-search-products';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import GridProducts from '@/components/products/grid-products';
import ProductCarousel from '@/components/products/product-carousel';
import {
  ActivityIndicator,
  colors,
  Pressable,
  Text,
  View,
} from '@/components/ui';
import { useUtility, UtilitySelector } from '@/lib/utility';

function Search() {
  const [search, setSearch] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [focused, setIsFocused] = React.useState<boolean>(false);
  const { addToRecent, recent_search, clearRecent } =
    useUtility(UtilitySelector);

  const { data, isFetching } = useGetProducts({
    limit: 8,
  })();
  const prods = React.useMemo(() => data?.pages[0]?.data || [], [data]);

  const { data: searchResult, isFetching: searchIsFetching } =
    useSearchProducts({ query: searchTerm })();
  const result = React.useMemo(
    () => searchResult?.pages[0] || [],
    [searchResult]
  );

  const products = React.useMemo(
    () => (Boolean(result.length) ? result : prods) || [],
    [result, prods]
  );

  const resultAvailable = Boolean(result.length && search && !searchIsFetching);

  const handleSearch = React.useCallback(
    (term: string) => {
      setSearchTerm(term);
      addToRecent(term);
    },
    [addToRecent]
  );

  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  React.useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const ListFooterComponent = (
    <View>
      <Container.Box containerClassName="bg-[#F7F7F7] px-0 pb-10">
        <ProductCarousel title={'Suggested Products'} />
      </Container.Box>
      <View className="mb-20" />
    </View>
  );

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
            onChangeText={(e) => {
              setSearch(e);
              debouncedHandleSearch(e);
            }}
            autoFocus
            numberOfLines={1}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rightIcon={
              searchIsFetching ? (
                <ActivityIndicator
                  color={colors.primaryText}
                  className="mt-1"
                />
              ) : undefined
            }
          />
        </View>
      }
    >
      {Boolean(
        !resultAvailable && Boolean(recent_search.length) && focused
      ) && (
        <Container.Box containerClassName="">
          <Text className="my-3 text-[16px] font-medium">Recently viewed</Text>

          {recent_search.map(
            (e, i) =>
              e !== '' && (
                <Text
                  key={i.toString()}
                  onPress={() => {
                    setSearchTerm(e);
                    setSearch(e);
                  }}
                  className="my-2 opacity-75"
                  numberOfLines={2}
                >
                  {e}
                </Text>
              )
          )}
          <Text
            className="mt-3 self-end text-[16px] underline"
            onPress={clearRecent}
          >
            Clear recent
          </Text>
        </Container.Box>
      )}

      <Container.Box containerClassName="flex-1 bg-[#F7F7F7]">
        {resultAvailable && (
          <View className="my-5 flex-row items-center justify-between">
            <Text className="text-[18px] font-medium">
              {result.length} results
            </Text>
            <Pressable className=" flex-row items-center justify-between gap-2">
              <Ionicons name="filter-sharp" size={20} color="#black" />
              <Text className="opacity-65">Filter</Text>
            </Pressable>
          </View>
        )}
        <GridProducts
          items={products}
          isLoading={isFetching}
          ListFooterComponent={ListFooterComponent}
        />
      </Container.Box>
    </Container.Page>
  );
}

export default Search;
