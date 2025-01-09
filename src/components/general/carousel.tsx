import { ImageBackground } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { View } from '../ui';

type Props = {
  data: any[];
};

const _Carousel = (props: Props) => {
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={{ height: width / 2, width }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={props.data || []}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ index, item }) => (
          <ImageBackground
            source={{ uri: item?.img }}
            key={index.toString()}
            className="size-full bg-primaryText object-cover"
            style={{ height: width / 2, width }}
          ></ImageBackground>
        )}
      />
      <View className="absolute bottom-2 flex-row self-center">
        {props?.data?.map((e, i) => (
          <View
            key={i.toString()}
            className="mx-1 size-[10px] rounded-full border border-black"
            style={{
              backgroundColor: currentIndex === i ? 'black' : 'transparent',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default _Carousel;
