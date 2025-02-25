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

  const { data, isFetching } = useGetProducts({
    type: props.type || undefined,
    limit: 5,
  })();
  const products = React.useMemo(() => data?.pages?.[0]?.data || [], [data]);

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
          onPress={() =>
            push(`/(main)/all-products?type=${props.type}&title=${props.title}`)
          }
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
