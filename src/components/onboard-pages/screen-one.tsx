import React from 'react';
import { useSharedValue } from 'react-native-reanimated';

import FlipBox from '../general/flip-box';
import { HEIGHT, Image, Pressable, View, WIDTH } from '../ui';

type Props = {};

const imgs = [
  {
    id: 1,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 2,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 3,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 4,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
  {
    id: 5,
    img: [
      'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
      'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
      'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
      'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
      'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
    ],
  },
];

function ScreenOne(props: Props) {
  const [text, setText] = React.useState('');
  const isFlipped = useSharedValue(false);
  const [array, setArray] = React.useState(imgs);
  const [indexToFlip, setIndexToFlip] = React.useState(0);
  const [logs, setLogs] = React.useState([]);

  // Run the randomize function every 5 seconds
  React.useEffect(() => {
    // const interval = setInterval(randomizeArray, 2000);
    // return () => clearInterval(interval); // Cleanup interval on unmount
  }, [array]);

  const FlipIt = (index: number) => {
    if (index === indexToFlip) {
      isFlipped.value = !isFlipped.value;
    }
  };
  return (
    <View
      className="top-10  w-full bg-green-500"
      style={{ height: HEIGHT / 2, width: WIDTH * 0.911 }}
    >
      {array.map((e, i) => (
        <FlipBox
          key={i.toString()}
          isFlipped={isFlipped}
          cardStyle={{
            height: 145,
            width: 105,
            borderRadius: 4,
            backfaceVisibility: 'hidden',
            overflow: 'hidden',
            marginVertical: 2,
          }}
          RegularContent={
            <Pressable
              className="flex-1 rounded-sm bg-red-500"
              onPress={() => FlipIt(i)}
            >
              <Image
                source={{ uri: e.img[Math.floor(Math.random() * 4)] }}
                style={{
                  height: 145,
                  width: 105,
                }}
                className="size-[100px] object-cover"
              />
            </Pressable>
          }
          FlippedContent={
            <Pressable
              className="flex-1 rounded-sm bg-cyan-500"
              onPress={() => FlipIt(i)}
            >
              <Image
                source={{ uri: e.img[Math.floor(Math.random() * 4)] }}
                style={{
                  height: 145,
                  width: 105,
                }}
                className="size-[100px] object-cover"
              />
            </Pressable>
          }
          direction={'y'}
        />
      ))}
    </View>
  );
}

export default ScreenOne;
