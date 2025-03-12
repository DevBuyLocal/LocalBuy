import React from 'react';
import { FlatList } from 'react-native';

import { useGetDeals } from '@/api/product/use-get-deals';

import { Text, View } from '../ui';

const DealsSection = () => {
  const { data: deals } = useGetDeals()();
  console.log('🚀 ~ DealsSection ~ deals:', deals);

  return (
    <FlatList
      data={[]}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }: { item: any }) => (
        <View>
          <Text>jsjj</Text>
        </View>
      )}
      scrollEnabled={false}
      className="w-full"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="w-full mt-3"
    />
  );
};

export default DealsSection;
