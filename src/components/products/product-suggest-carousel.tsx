import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';

import { useGetProducts } from '@/api';

import ViewAll from '../general/view-all';
import ProductItem from './product-item';

type ProductSuggestCarouselProps = {
  title: string;
  type?: string;
};

function ProductSuggestCarousel(props: ProductSuggestCarouselProps) {
  const { push } = useRouter();

  const { dismissAll } = useBottomSheetModal();

  const { data, isFetching } = useGetProducts({
    type: props.type || 'trending',
    limit: 5,
  })();
  // const products = normalizePages(data?.pages);
  const products = React.useMemo(() => data?.pages?.[0]?.data || [], [data]);
  // console.log('🚀 ~ ProductSuggestCarousel ~ products:', products);

  if (!isFetching && !Boolean(products.length)) return null;

  if (isFetching && Boolean(products?.length)) {
    return (
      <ScrollView horizontal contentContainerClassName="my-5">
        {Array.from({ length: 3 }).map((_, i) => (
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
            dismissAll();
            push(
              `/(main)/all-products?type=${props.type}&title=${props.title}`
            );
          }}
        />
        <ScrollView
          horizontal
          className="my-5"
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

export default ProductSuggestCarousel;
