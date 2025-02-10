import React from 'react';
import { FlatList } from 'react-native';
import { type IScreenProps } from 'react-native-story-carousel';

import { Image, Text, View, WIDTH } from '../ui';

function ScreenTwo({ onPrevious, isLastStep }: IScreenProps) {
  React.useEffect(() => {
    if (isLastStep) {
      const interval = setInterval(onPrevious, 5000);
      return () => clearInterval(interval);
    }
  }, [isLastStep, onPrevious]);

  const pngs = [
    { path: require('../../../assets/images/onboard-icons/onb-1.png') },
    { path: require('../../../assets/images/onboard-icons/onb-2.png') },
    { path: require('../../../assets/images/onboard-icons/onb-3.png') },
    { path: require('../../../assets/images/onboard-icons/onb-4.png') },
    { path: require('../../../assets/images/onboard-icons/onb-5.png') },
    { path: require('../../../assets/images/onboard-icons/onb-6.png') },
    { path: require('../../../assets/images/onboard-icons/onb-7.png') },
    { path: require('../../../assets/images/onboard-icons/onb-8.png') },
    { path: require('../../../assets/images/onboard-icons/onb-9.png') },
  ];

  return (
    <View className="top-10 justify-center" style={{ width: WIDTH * 0.911 }}>
      <FlatList
        data={pngs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-10 size-[78px] rounded-full bg-[#EFF2F7]">
            <Image source={item.path} className="size-[78px]" />
          </View>
        )}
        numColumns={3}
        columnWrapperClassName="justify-around"
        contentContainerClassName="mt-20"
        showsVerticalScrollIndicator={false}
      />
      <Text className="mt-10 w-4/5 self-center text-center text-[24px] leading-[36px] text-[#121212E5]">
        Your favorite brands are already on board
      </Text>
    </View>
  );
}

export default ScreenTwo;
