import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useGetProducts } from '@/api';
import { useSearchProducts } from '@/api/product/use-search-products';
import Container from '@/components/general/container';
import GridProducts from '@/components/products/grid-products';
import { Text, View } from '@/components/ui';

function AllProducts() {
  const {
    type,
    title,
    category,
    brand,
    search,
  }: { type: string; title: string; category: string; brand: string; search: string } =
    useLocalSearchParams();

  // Use search API if search query is provided
  const { data: searchData, isFetching: searchIsFetching } = useSearchProducts({ 
    query: search || '',
  })();

  // Use regular products API for filters
  // Show all products for categories/brands and non-"new" listings; keep 10 for "new arrivals"
  const computedLimit = type === 'new' ? 10 : 50; // Use 50 per page for pagination
  const { 
    data: productsData, 
    isFetching: productsIsFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetProducts({
    type,
    limit: computedLimit,
    categoryId: category ? Number(category) : undefined,
    manufacturerId: brand ? Number(brand) : undefined,
  })();

  // Fallback for New Arrivals: if API returns empty, show first 10 from unfiltered list
  const { data: fallbackAllData, isFetching: fallbackIsFetching } = useGetProducts({
    limit: 10,
  })();

  // Determine which data to use
  const isSearchMode = Boolean(search && search.trim());
  
  const items = React.useMemo(() => {
    if (isSearchMode && searchData?.pages[0]) {
      // If searchData.pages[0] is SearchApiResponse, extract the data property
      const searchResult = searchData.pages[0];
      return Array.isArray(searchResult) ? searchResult : (searchResult as any)?.data || [];
    }
    
    // For manufacturer/category filtering, get all pages of data
    if (brand || category) {
      if (!productsData?.pages || productsData.pages.length === 0) return [];
      const allItems = productsData.pages.flatMap(page => page.data || []);
      console.log('🔍 All Products - Manufacturer/Category items:', {
        brand,
        category,
        totalPages: productsData.pages.length,
        totalItems: allItems.length,
        items: allItems.map(item => ({ id: item.id, name: item.name }))
      });
      return allItems;
    }
    
    // For other cases, use first page only
    const base = productsData?.pages?.[0]?.data || [];
    if (type === 'new' && base.length === 0) {
      const fallback = fallbackAllData?.pages?.[0]?.data || [];
      return fallback.slice(0, 10);
    }
    return base;
  }, [isSearchMode, searchData, productsData, fallbackAllData, type, brand, category]);

  const isFetching = isSearchMode
    ? searchIsFetching
    : (productsIsFetching || (type === 'new' && fallbackIsFetching));

  return (
    <Container.Page showHeader showCart headerTitle={title || 'All Products'}>
      <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
        <GridProducts 
          items={items} 
          isLoading={isFetching}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && (brand || category)) {
              console.log('🔍 All Products - Fetching next page...');
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => 
            isFetchingNextPage ? (
              <View className="p-4">
                <Text className="text-center text-gray-500">Loading more products...</Text>
              </View>
            ) : null
          }
          removeClippedSubviews={false}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={10}
        />
      </Container.Box>
    </Container.Page>
  );
}

export default AllProducts;
