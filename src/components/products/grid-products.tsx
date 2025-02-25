import React from 'react';
import { FlatList, type FlatListProps } from 'react-native';

import { type TProduct } from '@/api';

import { View } from '../ui';
import ProductItem from './product-item';

interface GridProductsProps extends Partial<FlatListProps<TProduct>> {
  items: TProduct[];
  isLoading: boolean;
}

function GridProducts(props: GridProductsProps) {
  if (!props.isLoading && !Boolean(props?.items?.length)) return null;

  return (
    <View className="mt-3">
      <FlatList
        data={props.items || []}
        renderItem={({ item }) => (
          <ProductItem item={item} containerClassname=" w-[50%] max-w-[48%]" />
        )}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        initialNumToRender={6}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
        // ListFooterComponent={<View className="pb-10" />}
        {...props}
      />
      <View className="pb-10" />
    </View>
  );
}

export default GridProducts;
