import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView, ScrollView, View } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';

import ViewAll from '../general/view-all';
import ProductItem from './product-item';

type ProductCarouselProps = {
  items: any[];
  title: string;
  isLoading: boolean;
};

function ProductCarousel(props: ProductCarouselProps) {
  const { push } = useRouter();
  if (!props.isLoading && !Boolean(props?.items?.length)) return null;

  if (props.isLoading && Boolean(props?.items?.length)) {
    return (
      <ScrollView horizontal>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i.toString()} className="mr-5">
            <Skeleton width={158} height={220} radius={5} colorMode={'light'} />
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <AnimatePresence>
      {Boolean(props.items.length) && (
        <MotiView
          from={{ height: 0 }}
          animate={{ height: 320 }}
          exit={{
            height: 0,
          }}
        >
          <ViewAll
            title={props.title}
            onPress={() => push('/(main)/all-products')}
          />
          <ScrollView
            horizontal
            className="mt-5"
            showsHorizontalScrollIndicator={false}
          >
            {(props.items || []).map((e, i) => (
              <ProductItem
                item={e}
                key={i.toString()}
                containerClassname="mr-5"
              />
            ))}
          </ScrollView>
        </MotiView>
      )}
    </AnimatePresence>
  );
}

export default ProductCarousel;
