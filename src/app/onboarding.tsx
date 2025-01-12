import { useRouter } from 'expo-router';
import React from 'react';
import StoryCarousel from 'react-native-story-carousel';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import ScreenOne from '@/components/onboard-pages/screen-one';
import ScreenTwo from '@/components/onboard-pages/screen-two';
import { Text } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const { push } = useRouter();

  const screens = [
    {
      Screen: ScreenOne,
      duration: 7, // Display time in sec
      props: {
        /* Custom props for FirstScreen */
      },
    },
    {
      Screen: ScreenTwo,
      duration: 7,
      // If duration not defined then no progress bar, wait for user action
      props: {
        /* Custom props for SecondScreen */
      },
    },
  ];

  const style = {
    fillColor: '#0F3D30',
    unfillColor: '#0F3D3026',
    backgroundColor: 'transparent',
  };

  return (
    <Container.Page>
      <Container.Box containerClassName="h-3/4">
        <StoryCarousel style={style} screens={screens} />
      </Container.Box>
      <Container.Box containerClassName="px">
        <CustomButton label={'Sign me up'} onPress={() => push('/sign-up')} />
        <CustomButton.Secondary
          label={'I already have an account '}
          onPress={() => push('/login')}
        />
        <Text
          className="self-center px-10 font-bold color-primaryText"
          onPress={() => {
            // setIsFirstTime(false);
            push('/(main)');
          }}
        >
          Skip
        </Text>
      </Container.Box>
    </Container.Page>
  );
}
