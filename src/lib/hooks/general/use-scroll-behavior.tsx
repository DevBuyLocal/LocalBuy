import { useCallback, useRef } from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

interface ScrollBehaviorReturn {
  headerTranslateY: Animated.AnimatedInterpolation<string | number>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  // isVisible: boolean;
  handleLayout: (event: LayoutChangeEvent) => void;
  translateY: Animated.Value;
  scrollOffset: Animated.Value;
}

// const SCROLL_THRESHOLD = 20; // Minimum scroll distance to trigger hide/show
// const HEADER_HEIGHT = 60; // Adjust based on your UI

const useScrollBehavior = (): ScrollBehaviorReturn => {
  const scrollOffset = useRef(new Animated.Value(0)).current;
  // const [isVisible, setIsVisible] = useState<boolean>(true);
  // const lastScrollY = useRef<number>(0);
  // const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  const inputY = useRef<number | null>(null); // Ensure inputY is set only once
  // const [isSticky, setIsSticky] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;

  // Handle visibility animation
  // const animateVisibility = useCallback(
  //   (visible: boolean) => {
  //     Animated.spring(scrollOffset, {
  //       toValue: visible ? 0 : -HEADER_HEIGHT,
  //       useNativeDriver: true,
  //       tension: 50,
  //       friction: 10,
  //     }).start();
  //     setIsVisible(visible);
  //   },
  //   [scrollOffset]
  // );

  // Capture the input's initial position
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    if (inputY.current === null) {
      inputY.current = event.nativeEvent.layout.y;
    }
  }, []);

  // Animate input sticking to the top
  // const animateInput = useCallback(
  //   (stick: boolean) => {
  //     if (isSticky === stick) return; // Prevent unnecessary re-renders
  //     Animated.timing(translateY, {
  //       toValue: stick ? -inputY.current! + HEADER_HEIGHT : 0,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start();
  //     setIsSticky(stick);
  //   },
  //   [isSticky, translateY]
  // );

  // Scroll event handling
  // const onScroll = useCallback(
  //   (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     if (scrollTimer.current) {
  //       clearTimeout(scrollTimer.current);
  //     }

  //     const currentScrollY = event.nativeEvent.contentOffset.y;
  //     scrollTimer.current = setTimeout(() => {
  //       const scrollDelta = currentScrollY - lastScrollY.current;

  //       if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) {
  //         return;
  //       }

  //       // Hide/show elements on scroll
  //       animateVisibility(scrollDelta <= 0);

  //       // Sticky input logic
  //       if (inputY.current !== null) {
  //         if (currentScrollY >= inputY.current - HEADER_HEIGHT && !isSticky) {
  //           animateInput(true);
  //         } else if (currentScrollY <= inputY.current && isSticky) {
  //           animateInput(false); // Unstick when fully scrolled back
  //         }
  //       }

  //       lastScrollY.current = currentScrollY;
  //     }, 20);
  //   },
  //   [animateVisibility, isSticky, animateInput]
  // );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
    { useNativeDriver: false }
  );

  return {
    headerTranslateY: scrollOffset,
    translateY,
    onScroll,
    // isVisible,
    handleLayout,
    scrollOffset,
  };
};

export default useScrollBehavior;
