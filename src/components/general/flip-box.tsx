import React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { View } from '../ui';

interface TFlipBox {
  isFlipped: SharedValue<boolean>;
  RegularContent: React.JSX.Element;
  FlippedContent?: React.JSX.Element;
  direction: 'y' | 'x';
  duration?: number;
  cardStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const FlipBox = ({
  isFlipped,
  cardStyle,
  direction = 'x',
  duration = 400,
  RegularContent,
  FlippedContent,
}: TFlipBox) => {
  const isDirectionX = direction === 'x';

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <View>
      <Animated.View
        style={[flipBoxStyles.regularCard, cardStyle, regularCardAnimatedStyle]}
      >
        {RegularContent || FlippedContent}
      </Animated.View>
      <Animated.View
        style={[flipBoxStyles.flippedCard, cardStyle, flippedCardAnimatedStyle]}
      >
        {FlippedContent}
      </Animated.View>
    </View>
  );
};

const flipBoxStyles = StyleSheet.create({
  regularCard: {
    position: 'absolute',
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
});

export default FlipBox;
