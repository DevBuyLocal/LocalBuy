import { View } from 'moti';
import React from 'react';

import Container from '@/components/general/container';
import CustomInput from '@/components/general/custom-input';

function AllProducts() {
  const [search, setSearch] = React.useState<string>('');
  return (
    <Container.Page
      showHeader
      showCart
      headerComponent={
        <View className="w-[70%]">
          <CustomInput
            isSearch
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      }
    >
      <></>
    </Container.Page>
  );
}

export default AllProducts;
