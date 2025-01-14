import React from 'react';
import { FlatList } from 'react-native';

import { View } from '../ui';
import ProductItem from './product-item';

type GridProductsProps = {
  items: any[];
  isLoading: boolean;
};

function GridProducts(props: GridProductsProps) {
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
      />
    </View>
  );
}

export default GridProducts;
