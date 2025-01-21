import React from 'react';
import { FlatList, type FlatListProps } from 'react-native';

import { View } from '../ui';
import ProductItem from './product-item';

interface GridProductsProps<T> extends Partial<FlatListProps<T>> {
  items: any[];
  isLoading: boolean;
}

function GridProducts<T>({ props }: { props: GridProductsProps<T> }) {
  if (!props.isLoading && !Boolean(props?.items?.length)) return null;

  return (
    <View>
      <FlatList
        data={props.items || []}
        renderItem={({ item }) => (
          <ProductItem item={item} containerClassname=" w-[50%] max-w-[48%]" />
        )}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
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
