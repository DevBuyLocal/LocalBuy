import { useRouter } from 'expo-router';
import React from 'react';
import StoryCarousel from 'react-native-story-carousel';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import ScreenOne from '@/components/onboard-pages/screen-one';
import ScreenTwo from '@/components/onboard-pages/screen-two';
import { Modal, Radio, useModal, View } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

type UserTypeProps = {
  value: 'individual' | 'business';
};
const userType: { name: string; value: 'individual' | 'business' }[] = [
  { name: 'Individual', value: 'individual' },
  { name: 'Business Owner', value: 'business' },
];

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const { push } = useRouter();

  const { ref, present, dismiss } = useModal();
  const [selectedRole, setSelectedRole] =
    React.useState<UserTypeProps['value']>('individual');

  const screens = [
    {
      Screen: ScreenOne,
      duration: 5, // Display time in sec
      props: {
        /* Custom props for FirstScreen */
      },
    },
    {
      Screen: ScreenTwo,
      duration: 5,
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
      <Container.Box containerClassName="h-[75%]">
        <StoryCarousel style={style} screens={screens} />
      </Container.Box>
      <Container.Box containerClassName="px">
        <CustomButton
          label={'Get started'}
          onPress={() => {
            present();
            // push('/sign-up');
          }}
        />
        <CustomButton.Secondary
          label={'Continue as guest'}
          onPress={() => {
            setIsFirstTime(false);
            push('/(main)');
          }}
          // onPress={() => push('/login')}
        />
        {/* <Text
          className="self-center px-10 font-bold color-primaryText"
          onPress={() => {
            setIsFirstTime(false);
            push('/(main)');
          }}
        >
          Skip
        </Text> */}
      </Container.Box>

      <Modal ref={ref} title="Are you an individual or a business owner?">
        <View className="mt-2 px-5">
          {userType.map((e, i) => (
            <View key={i.toString()} className="py-5">
              <Radio.Root
                checked={e.value === selectedRole}
                onChange={() => setSelectedRole(e.value)}
                accessibilityLabel="radio button"
                className="justify-between  pb-2"
              >
                <Radio.Label text={e.name} className="text-[16px]" />
                <Radio.Icon checked={selectedRole === e.value} />
              </Radio.Root>
              {i === 0 && <View className="top-4 h-px bg-[#1212121A]" />}
            </View>
          ))}
          <CustomButton
            label={'Continue'}
            onPress={() => {
              push(`/sign-up?role=${selectedRole}`);
              dismiss();
            }}
          />
        </View>
      </Modal>
    </Container.Page>
  );
}
