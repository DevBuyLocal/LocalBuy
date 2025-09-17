import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { FlatList, type FlatListProps, ScrollView } from 'react-native';

import { type TProduct } from '@/api';

import Empty from '../general/empty';
import { View } from '../ui';
import ProductItem from './product-item';

interface GridProductsProps extends Partial<FlatListProps<TProduct>> {
  items: TProduct[];
  isLoading: boolean;
}

function GridProducts(props: GridProductsProps) {
  const { items, isLoading, ...flatListProps } = props;

  if (isLoading && (!items || items.length === 0)) {
    return (
      <ScrollView horizontal contentContainerClassName="mt-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <View key={i.toString()} className="mr-5 ">
            <Skeleton width={158} height={220} radius={5} colorMode={'light'} />
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="mt-3">
      <FlatList
        data={items || []}
        renderItem={({ item }) => (
          <ProductItem item={item} containerClassname=" w-[50%] max-w-[48%]" />
        )}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
        ListEmptyComponent={
          <Empty containerClassName="mt-10" desc="No product found" />
        }
        removeClippedSubviews={false}
        {...flatListProps}
      />
      <View className="pb-10" />
    </View>
  );
}

export default GridProducts;
