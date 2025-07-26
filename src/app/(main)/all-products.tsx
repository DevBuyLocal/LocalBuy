import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useGetProducts } from '@/api';
import { useSearchProducts } from '@/api/product/use-search-products';
import Container from '@/components/general/container';
import GridProducts from '@/components/products/grid-products';

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
  const { data: productsData, isFetching: productsIsFetching } = useGetProducts({
    type,
    limit: 10,
    categoryId: category ? Number(category) : undefined,
    manufacturerId: brand ? Number(brand) : undefined,
  })();

  // Determine which data to use
  const isSearchMode = Boolean(search && search.trim());
  const isFetching = isSearchMode ? searchIsFetching : productsIsFetching;
  
  const items = React.useMemo(() => {
    if (isSearchMode && searchData?.pages[0]) {
      return searchData.pages[0];
    }
    return productsData?.pages[0]?.data || [];
  }, [isSearchMode, searchData, productsData]);

  return (
    <Container.Page showHeader showCart headerTitle={title || 'All Products'}>
      <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
        <GridProducts items={items} isLoading={isFetching} />
      </Container.Box>
    </Container.Page>
  );
}

export default AllProducts;
