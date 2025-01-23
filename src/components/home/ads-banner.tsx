import { AnimatePresence, MotiText, MotiView } from 'moti';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import _Carousel from '@/components/general/carousel';
import CustomButton from '@/components/general/custom-button';
import { Image, Text, View } from '@/components/ui';

interface AdsBannerProps {
  imgs: {
    id: number;
    img: string[];
  }[];
}

export const AdsBanner = ({ imgs }: AdsBannerProps) => {
  const [index, setIndex] = React.useState<0 | 1>(0);
  const defaultBanners = [
    {
      label: 'Easy Shopping',
      desc: 'Order groceries effortlessly, get them delivered right to your door',
      bgColor: '#FFF5E1',
      id: 'jsjiwi',
    },
    {
      label: 'Daily Delights',
      desc: 'Get everything you need for your daily meals right at your fingertips.',
      bgColor: '#C9FCE9',
      id: 'sjejejj',
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (index === 0) {
        setIndex(1);
      } else {
        setIndex(0);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [index]);

  return !Boolean(imgs.length) ? (
    <_Carousel data={imgs || []} />
  ) : (
    <>
      <AnimatePresence>
        <MotiView
          from={{ backgroundColor: defaultBanners[index].bgColor }}
          animate={{ backgroundColor: defaultBanners[index].bgColor }}
          transition={{ type: 'timing', duration: 650 }}
          className="mt-5 h-[130px] w-full flex-row items-center overflow-hidden rounded-[13px] p-5"
        >
          <View className="h-full w-3/5 justify-between">
            <View>
              <MotiText className="text-[16px] font-bold">
                {defaultBanners[index].label}
              </MotiText>
              <Text className="mt-1 text-[12px] opacity-75">
                {defaultBanners[index].desc}
              </Text>
            </View>
            <CustomButton
              label="SHOP NOW"
              containerClassname="h-[27px] rounded-full mb-0 text-[12px]"
              textClassName="text-[12px]"
            />
          </View>

          <Image
            source={require('../../../assets/images/banner-icon.png')}
            className="absolute right-0 size-[128px]"
          />
        </MotiView>
      </AnimatePresence>
      <View className="mt-2 flex-row gap-2 self-center">
        {defaultBanners.map((e, i) => (
          <View
            key={e.id}
            className={twMerge(
              'h-[2px] w-14 ',
              i === index ? 'bg-black' : 'bg-[#030C0A1F]'
            )}
          />
        ))}
      </View>
    </>
  );
};
