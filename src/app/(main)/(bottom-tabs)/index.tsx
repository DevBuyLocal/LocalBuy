import { useState } from 'react';

import _Carousel from '@/components/general/carousel';
import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { Text } from '@/components/ui';

const imgs = [
  { img: 'https://rollupbanners.ng/wp-content/uploads/rollup-banner567.jpg' },
  {
    img: 'https://img.freepik.com/free-psd/brand-consulting-banner-template_23-2148938800.jpg',
  },
  {
    img: 'https://www.bannerbuzz.co.uk/blog/wp-content/uploads/2024/02/BB_UK_Blog_How-Pop-Up-Display-Banners-Redefine-Instant-Impact-in-Marketing_01-1-1024x441.webp',
  },
  {
    img: 'https://sprak-11536.kxcdn.com/wp-content/uploads/2022/09/4-how-to-choose-the-best-professional-banner-design-services.png',
  },
];

export default function Home() {
  // const { setSuccess, loading, setLoading, setError } = useLoader();
  const [text, setText] = useState('');

  return (
    <Container.Page className="px-0" showHeader headerTitle="Create an account">
      <Container.Box>
        <Text className="font-regular">Homea</Text>
        <CustomButton label={'Remind me later'} onPress={() => {}} />
        <CustomInput
          value={text}
          onChangeText={setText}
          keyboardAppearance="default"
          placeholder="Name & number"
          isPassword
        />
        <CustomInput value={text} onChangeText={setText} isSearch />
        <CountdownTimer
          countFrom={10}
          onCountdownComplete={() => {
            console.log('first');
          }}
        />
      </Container.Box>
      <_Carousel data={imgs} />
    </Container.Page>
  );
}
