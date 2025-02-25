import { useRouter } from 'expo-router';
import React from 'react';

import { useGetManufacturers } from '@/api/manufacturers';
import { type TSingleManufacturers } from '@/api/manufacturers/types';
import ViewAll from '@/components/general/view-all';
import { Image, Text, View } from '@/components/ui';

const Item = ({ e }: { e: TSingleManufacturers }) => {
  const [imgSrc, setImgSrc] = React.useState(e.logo ? e.logo : null);

  return (
    <View className="mt-3 h-[124px] w-[112px] rounded-[12px] bg-[#F7f7f7] p-3 dark:bg-[#282828]">
      <View className="size-[45px] overflow-hidden rounded-full bg-[#F7F7F7]">
        <Image
          source={
            imgSrc
              ? { uri: imgSrc }
              : require('../../../assets/images/img-p-holder.png')
          }
          onError={() => {
            setImgSrc(null);
          }}
          className="size-full rounded-full bg-white"
          contentFit="contain"
          style={{
            tintColor: imgSrc ? undefined : '#D5D5D5',
          }}
        />
      </View>
      <Text className="mt-3 text-[12px] font-bold" numberOfLines={2}>
        {e?.name}
      </Text>
    </View>
  );
};

const FeaturedBrands = () => {
  const { push } = useRouter();
  const { data } = useGetManufacturers({ limit: 10, page: 1 })();
  const brands = React.useMemo(() => data?.pages[0]?.data || [], [data]);
  if (!brands.length) return null;

  return (
    <View>
      <ViewAll
        title={'Stores for you'}
        onPress={() => push('/all-brands')}
        seeAllBg="#F7F7F7"
      />

      <View className="mb-5 flex-row flex-wrap justify-between">
        {brands.map((e, i) => (
          <Item e={e} key={i.toString()} />
        ))}
      </View>
    </View>
  );
};

export default FeaturedBrands;
