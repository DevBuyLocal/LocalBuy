import { useEffect } from 'react';
import { array } from 'zod';

import _Carousel from '@/components/general/carousel';
import Container from '@/components/general/container';
import GridProducts from '@/components/products/grid-products';
import { ScrollView } from '@/components/ui';

import dummyProducts from '../../../lib/dummy';

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

// eslint-disable-next-line max-lines-per-function
export default function Home() {
  // const [text, setText] = useState('');
  // const isFlipped = useSharedValue(false);
  // const [array, setArray] = useState(imgs);
  // const [indexToFlip, setIndexToFlip] = useState(0);
  // const [logs, setLogs] = useState([]);

  // Run the randomize function every 5 seconds
  useEffect(() => {
    // clearCart();
    // const interval = setInterval(randomizeArray, 2000);
    // return () => clearInterval(interval); // Cleanup interval on unmount
  }, [array]);

  // const FlipIt = (index: number) => {
  //   if (index === indexToFlip) {
  //     isFlipped.value = !isFlipped.value;
  //   }
  // };

  return (
    <ScrollView>
      <Container.Page className="px-0">
        <_Carousel data={imgs} />

        <Container.Box containerClassName="bg-[#F7F7F7] py-5">
          <GridProducts items={dummyProducts} isLoading={false} />
          {/* <ProductCarousel
            items={dummyProducts}
            title={'New Arrivals'}
            isLoading={false}
          /> */}
        </Container.Box>
      </Container.Page>
    </ScrollView>
  );
}
