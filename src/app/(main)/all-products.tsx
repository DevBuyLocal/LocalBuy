import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { useGetProducts } from '@/api';
import Container from '@/components/general/container';
import GridProducts from '@/components/products/grid-products';

function AllProducts() {
  const {
    type,
    title,
    category,
  }: { type: string; title: string; category: string } = useLocalSearchParams();
  console.log('🚀 ~ AllProducts ~ category:', category);

  const { data, isFetching } = useGetProducts({
    type,
    limit: 10,
    categoryId: category ? Number(category) : undefined,
  })();

  const items = React.useMemo(() => data?.pages[0]?.data || [], [data]);
  return (
    <Container.Page showHeader showCart headerTitle={title || 'All Products'}>
      <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
        <GridProducts items={items} isLoading={isFetching} />
      </Container.Box>
    </Container.Page>
  );
}

export default AllProducts;
