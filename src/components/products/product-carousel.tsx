import { useRouter } from 'expo-router';
import { ScrollView, View } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';

import { useGetProducts } from '@/api';

import ViewAll from '../general/view-all';
import ProductItem from './product-item';

type ProductCarouselProps = {
  title: string;
  type?: string;
};

const LOADER_COUNT = 3;

function ProductCarousel(props: ProductCarouselProps) {
  const { push } = useRouter();

  // Primary query: filtered by type when provided
  const { data: typedData, isFetching: isFetchingTyped } = useGetProducts({
    type: props.type || undefined,
    limit: 5,
  })();
  const typedProducts = React.useMemo(
    () => typedData?.pages?.[0]?.data || [],
    [typedData]
  );

  // Fallback query: no type filter, only used when typedProducts is empty
  const { data: fallbackData, isFetching: isFetchingFallback } = useGetProducts({
    limit: 5,
  })();
  const fallbackProducts = React.useMemo(
    () => fallbackData?.pages?.[0]?.data || [],
    [fallbackData]
  );

  const isFetching = isFetchingTyped && (!typedProducts.length || !!props.type);
  const products = typedProducts.length ? typedProducts : fallbackProducts;

  if (!isFetching && !Boolean(products.length)) return <View />;

  if (isFetching && !Boolean(products?.length)) {
    return (
      <ScrollView horizontal contentContainerClassName="mt-5">
        {Array.from({ length: LOADER_COUNT }).map((_, i) => (
          <View key={i.toString()} className="mr-5 ">
            <Skeleton width={158} height={220} radius={5} colorMode={'light'} />
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    Boolean(products.length) && (
      <>
        <ViewAll
          title={props.title}
          onPress={() => {
            const safeTitle = props.title || 'All Products';
            // Preserve type only for New Arrivals; others should show all
            if (props.type === 'new') {
              push(
                `/(main)/all-products?type=${encodeURIComponent(
                  props.type
                )}&title=${encodeURIComponent(safeTitle)}`
              );
            } else {
              push(`/(main)/all-products?title=${encodeURIComponent(safeTitle)}`);
            }
          }}
        />
        <ScrollView
          horizontal
          className="mt-5"
          showsHorizontalScrollIndicator={false}
        >
          {products.map((e, i) => (
            <ProductItem
              item={e}
              key={i.toString()}
              containerClassname="mr-3"
            />
          ))}
        </ScrollView>
      </>
    )
  );
}

export default ProductCarousel;
