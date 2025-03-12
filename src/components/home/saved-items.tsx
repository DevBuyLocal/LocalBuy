import React from 'react';
import { FlatList } from 'react-native';

import { type SavedProductResponse } from '@/api/product/use-get-saved-products';

import SavedProductItem from '../products/saved-product-item';

type Props = {
  savedProducts: SavedProductResponse | undefined;
};

const SavedItems = (props: Props) => {
  console.log('🚀 ~ SavedItems ~ props:', props?.savedProducts?.savedProducts);
  return (
    <FlatList
      data={props.savedProducts?.savedProducts || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <SavedProductItem item={item?.product} />}
      scrollEnabled={false}
      className="w-full"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="w-full mt-3"
    />
  );
};

export default SavedItems;
