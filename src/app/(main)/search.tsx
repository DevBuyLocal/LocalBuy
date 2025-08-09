import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import debounce from 'lodash.debounce';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useLocalSearchParams } from 'expo-router';

import { useGetProducts } from '@/api';
import { useSearchProducts } from '@/api/product/use-search-products';
import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';
import FilterModal from '@/components/products/filter-modal';
import GridProducts from '@/components/products/grid-products';
import ProductCarousel from '@/components/products/product-carousel';
import {
  ActivityIndicator,
  colors,
  Pressable,
  Text,
  useModal,
  View,
} from '@/components/ui';
import { useUtility, UtilitySelector } from '@/lib/utility';

function Search() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const [search, setSearch] = React.useState<string>(q || '');
  const [searchTerm, setSearchTerm] = React.useState<string>(q || '');
  const [focused, setIsFocused] = React.useState<boolean>(false);
  const { addToRecent, recent_search, clearRecent } =
    useUtility(UtilitySelector);
  
  // Filter modal state
  const { present: filterPresent, ref: filterRef, dismiss: filterDismiss } = useModal();
  
  const { data, isFetching } = useGetProducts({
    limit: 8,
  })();
  const prods = React.useMemo(() => data?.pages[0]?.data || [], [data]);
  const { data: searchResult, isFetching: searchIsFetching } =
    useSearchProducts({ query: searchTerm })();
  const result = React.useMemo(
    () => searchResult?.pages[0]?.data || [],
    [searchResult]
  );
  
  const products = React.useMemo(
    () => {
      // If we have a search term and are actively searching, only show search results
      if (searchTerm.trim()) {
        return result || [];
      }
      // If no search term, show default products
      return prods || [];
    },
    [result, prods, searchTerm]
  );
  const resultAvailable = Boolean(searchTerm.trim() && result.length > 0 && !searchIsFetching);
  const handleSearch = React.useCallback(
    (term: string) => {
      setSearchTerm(term);
      addToRecent(term);
    },
    [addToRecent]
  );
  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 800),
    [handleSearch]
  );
  
  // Trigger search when component mounts with query parameter
  React.useEffect(() => {
    if (q && q.trim()) {
      setSearchTerm(q.trim());
      addToRecent(q.trim());
    }
  }, [q, addToRecent]);
  
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
              ) : (
                <Pressable
                  onPress={() => {
                    setSearch('');
                    setSearchTerm('');
                  }}
                  className={twMerge(
                    'pl-2 py-2',
                    !search.length && 'opacity-0'
                  )}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={18}
                    color={'black'}
                  />
                </Pressable>
              )
            }
          />
        </View>
      }
    >
      {Boolean(
        !resultAvailable &&
          Boolean(recent_search.length) &&
          focused &&
          search.length
      ) && (
        <Container.Box containerClassName="">
          <Text className="my-3 text-[16px] font-medium">Recently viewed</Text>
          {recent_search.map(
            (e, i) =>
              e !== '' &&
              e.length > 2 && (
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
            <Pressable 
              className=" flex-row items-center justify-between gap-2"
              onPress={filterPresent}
            >
              <Ionicons name="filter-sharp" size={20} color="#black" />
              <Text className="text-[#121212BF]">Filter</Text>
            </Pressable>
          </View>
        )}
        
        {searchTerm.trim() && !searchIsFetching && result.length === 0 && (
          <View className="my-10 items-center">
            <Text className="text-[18px] font-medium text-[#121212BF] mb-2">
              No products found
            </Text>
            <Text className="text-[14px] text-[#12121280] text-center">
              Try adjusting your search terms or browse our categories
            </Text>
          </View>
        )}
        
        <GridProducts
          items={products}
          isLoading={searchTerm.trim() ? searchIsFetching : isFetching}
          ListFooterComponent={searchTerm.trim() ? undefined : ListFooterComponent}
        />
      </Container.Box>
      <FilterModal ref={filterRef} dismiss={filterDismiss} />
    </Container.Page>
  );
}

export default Search;
