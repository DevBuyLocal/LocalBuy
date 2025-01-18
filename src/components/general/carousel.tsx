import { ImageBackground } from 'expo-image';
import React, { useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';

import { View, WIDTH } from '../ui';

type Props = {
  data: any[];
};

const _Carousel = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View
      style={{
        height: WIDTH / 2,
        width: WIDTH * 0.911,
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <Carousel
        loop
        width={WIDTH * 0.911}
        height={WIDTH / 2}
        autoPlay={true}
        data={props.data || []}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ index, item }) => (
          <ImageBackground
            source={{ uri: item?.img[0] }}
            key={index.toString()}
            className="size-full object-cover"
            style={{ height: WIDTH / 2, width: WIDTH }}
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
