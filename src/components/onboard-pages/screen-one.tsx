import React from 'react';

import { HEIGHT, Image, Text, View, WIDTH } from '../ui';

// const imgs = [
//   {
//     id: 1,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 2,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 3,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 4,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
//   {
//     id: 5,
//     img: [
//       'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg',
//       'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
//       'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
//       'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
//       'https://thumbs.dreamstime.com/b/banner-abstract-template-design-background-colorful-geometric-shapes-lines-modern-vector-163107316.jpg',
//     ],
//   },
// ];

function ScreenOne() {
  // const [text, setText] = React.useState('');
  // const isFlipped = useSharedValue(false);
  // const [array, setArray] = React.useState(imgs);
  // const [indexToFlip, setIndexToFlip] = React.useState(0);
  // const [logs, setLogs] = React.useState([]);

  // Run the randomize function every 5 seconds
  // React.useEffect(() => {
  // const interval = setInterval(randomizeArray, 2000);
  // return () => clearInterval(interval); // Cleanup interval on unmount
  // }, [array]);

  return (
    <View
      className="size-full items-center overflow-hidden"
      style={{ width: WIDTH * 0.911 }}
    >
      <Image
        source={require('../../../assets/images/onboard-img.png')}
        className="mt-12 w-full self-center"
        style={{ height: HEIGHT * 0.57, width: WIDTH }}
        contentFit="contain"
      />
      <View className="absolute -bottom-1 z-40 h-[160px] w-[110%] rotate-3 bg-white dark:bg-black" />
      <Text className=" absolute bottom-2 z-50 w-[90%] self-center text-center text-[24px] leading-[36px] text-[#121212E5]">
        Enjoy easy online shopping for bulk food items and other essentials.
      </Text>
    </View>
  );

  // const FlipIt = (index: number) => {
  //   if (index === indexToFlip) {
  //     isFlipped.value = !isFlipped.value;
  //   }
  // };
  // return (
  //   <View
  //     className="top-10  w-full bg-green-500"
  //     style={{ height: HEIGHT / 2, width: WIDTH * 0.911 }}
  //   >
  //     {array.map((e, i) => (
  //       <FlipBox
  //         key={i.toString()}
  //         isFlipped={isFlipped}
  //         cardStyle={{
  //           height: 145,
  //           width: 105,
  //           borderRadius: 4,
  //           backfaceVisibility: 'hidden',
  //           overflow: 'hidden',
  //           marginVertical: 2,
  //         }}
  //         RegularContent={
  //           <Pressable
  //             className="flex-1 rounded-sm bg-red-500"
  //             onPress={() => FlipIt(i)}
  //           >
  //             <Image
  //               source={{ uri: e.img[Math.floor(Math.random() * 4)] }}
  //               style={{
  //                 height: 145,
  //                 width: 105,
  //               }}
  //               className="size-[100px] object-cover"
  //             />
  //           </Pressable>
  //         }
  //         FlippedContent={
  //           <Pressable
  //             className="flex-1 rounded-sm bg-cyan-500"
  //             onPress={() => FlipIt(i)}
  //           >
  //             <Image
  //               source={{ uri: e.img[Math.floor(Math.random() * 4)] }}
  //               style={{
  //                 height: 145,
  //                 width: 105,
  //               }}
  //               className="size-[100px] object-cover"
  //             />
  //           </Pressable>
  //         }
  //         direction={'y'}
  //       />
  //     ))}
  //   </View>
  // );
}

// busola@kinexus.app;

export default ScreenOne;
