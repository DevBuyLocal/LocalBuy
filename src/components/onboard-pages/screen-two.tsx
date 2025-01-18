import React from 'react';
import { FlatList } from 'react-native';
import { type IScreenProps } from 'react-native-story-carousel';

import { Text, View, WIDTH } from '../ui';

function ScreenTwo({ onPrevious, isLastStep }: IScreenProps) {
  React.useEffect(() => {
    if (isLastStep) {
      const interval = setInterval(onPrevious, 5000);
      return () => clearInterval(interval);
    }
  }, [isLastStep, onPrevious]);

  return (
    <View className="top-10 justify-center" style={{ width: WIDTH * 0.911 }}>
      <FlatList
        data={Array.from({ length: 9 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
          <View className="mb-10 size-[78px] rounded-full bg-[#EFF2F7]" />
        )}
        numColumns={3}
        columnWrapperClassName="justify-around"
        contentContainerClassName="mt-20"
      />
      <Text className="mt-10 w-4/5 self-center text-center text-[24px] leading-[36px] text-[#121212E5]">
        Your favorite brands are already on board
      </Text>
    </View>
  );
}

export default ScreenTwo;
