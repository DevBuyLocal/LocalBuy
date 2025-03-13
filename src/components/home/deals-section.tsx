import { View } from 'moti';
import React, { forwardRef } from 'react';
import { FlatList } from 'react-native';

import { type TDeal } from '@/api';
import { useGetDeals } from '@/api/product/use-get-deals';
import { Image, Pressable } from '@/components/ui';

import Container from '../general/container';
import { Text } from '../ui';

const DealsItem = ({ item }: { item: TDeal }) => {
  const [imgSrc, setImgSrc] = React.useState(item?.image || null);
  return (
    <Pressable className="mr-5 h-[203px] w-[90%] overflow-hidden rounded-[10px] bg-[#f7f7f7]">
      <Image
        source={
          imgSrc
            ? { uri: imgSrc }
            : require('../../../assets/images/img-p-holder.png')
        }
        className="h-[131px] w-full mix-blend-multiply"
        contentFit="cover"
        style={{
          tintColor: imgSrc ? undefined : '#D5D5D580',
        }}
        onError={() => {
          setImgSrc(null);
        }}
      />
      <View className="gap-2 px-5">
        <Text className="text-[16px] font-bold">{item?.name}</Text>
        <Text className="text-[14px] font-normal uppercase" numberOfLines={1}>
          {item?.description}
        </Text>
      </View>
    </Pressable>
  );
};

type TDealsSection = {};
const DealsSection = forwardRef<any, TDealsSection>((props, ref) => {
  const { data: deals } = useGetDeals()();

  if (!deals?.data.length) return null;

  return (
    <Container.Box containerClassName="py-3">
      <Text className="mb-2 text-[18px] font-bold">Your Deals</Text>
      <FlatList
        ref={ref}
        data={deals?.data || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <DealsItem item={item} />}
        horizontal
        className="w-full"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="w-full mt-3"
        {...props}
      />
    </Container.Box>
  );
});

export default DealsSection;
