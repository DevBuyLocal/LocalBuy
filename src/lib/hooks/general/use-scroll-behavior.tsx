import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

interface ScrollBehaviorReturn {
  headerTranslateY: Animated.AnimatedInterpolation<string | number>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isVisible: boolean;
}

const SCROLL_THRESHOLD = 20; // Minimum scroll distance to trigger hide/show

const useScrollBehavior = (): ScrollBehaviorReturn => {
  const scrollOffset = useRef<Animated.Value>(new Animated.Value(0))?.current;
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollY = useRef<number>(0);
  const scrollTimer = useRef<NodeJS.Timeout>();

  const animateVisibility = useCallback(
    (visible: boolean) => {
      Animated.spring(scrollOffset, {
        toValue: visible ? 0 : -100,
        useNativeDriver: true, // Changed to true for consistency
        tension: 50,
        friction: 10,
      }).start();
      setIsVisible(visible);
    },
    [scrollOffset]
  );

  // Changed from Animated.event to regular function
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      const currentScrollY = event.nativeEvent.contentOffset.y;

      scrollTimer.current = setTimeout(() => {
        const scrollDelta = currentScrollY - lastScrollY.current;

        if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) {
          return;
        }

        if (scrollDelta > 0) {
          animateVisibility(false);
        } else {
          animateVisibility(true);
        }

        lastScrollY.current = currentScrollY;
      }, 20);
    },
    [animateVisibility]
  );

  const headerTranslateY = scrollOffset;

  return { headerTranslateY, onScroll, isVisible };
};

export default useScrollBehavior;
