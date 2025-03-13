// IMPORT NECESSARY DEPENDENCIES
import { useRouter } from 'expo-router';
import React from 'react';
import StoryCarousel from 'react-native-story-carousel';

import { queryClient, QueryKey, useGetUser } from '@/api';
import { useGetCartItems } from '@/api/cart';
// IMPORT CUSTOM COMPONENTS AND HOOKS
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import ScreenOne from '@/components/onboard-pages/screen-one';
import ScreenTwo from '@/components/onboard-pages/screen-two';
import { Modal, Radio, useModal, View } from '@/components/ui';
import { UserType, userType } from '@/lib/constants';
import { useIsFirstTime } from '@/lib/hooks';

// DEFINE TYPES FOR USER ROLES

/**
 * ONBOARDING COMPONENT THAT HANDLES THE INITIAL USER FLOW
 * SHOWS A STORY CAROUSEL WITH ONBOARDING SCREENS AND USER TYPE SELECTION
 */
export default function Onboarding() {
  // HOOKS FOR MANAGING APP STATE AND NAVIGATION
  const [_, setIsFirstTime] = useIsFirstTime();
  const { replace, push } = useRouter();
  const { ref, present, dismiss } = useModal();
  // STATE FOR MANAGING SELECTED USER ROLE
  const [selectedRole, setSelectedRole] = React.useState<UserType>(
    UserType.Individual
  );

  useGetUser();
  useGetCartItems();

  React.useEffect(() => {
    queryClient.fetchQuery({ queryKey: [QueryKey.PRODUCTS] });
    queryClient.fetchQuery({ queryKey: [QueryKey.MANUFACTURERS] });
    queryClient.fetchQuery({ queryKey: [QueryKey.CATEGORIES] });
  }, []);

  // CONFIGURATION FOR ONBOARDING SCREEN CAROUSEL
  const screens = [
    {
      Screen: ScreenOne,
      duration: 5, // DISPLAY TIME IN SEC
      props: {
        /* CUSTOM PROPS FOR FIRSTSCREEN */
      },
    },
    {
      Screen: ScreenTwo,
      duration: 5,
      // IF DURATION NOT DEFINED THEN NO PROGRESS BAR, WAIT FOR USER ACTION
      props: {
        /* CUSTOM PROPS FOR SECONDSCREEN */
      },
    },
  ];

  // STYLES FOR THE STORY CAROUSEL
  const style = {
    fillColor: '#0F3D30',
    unfillColor: '#0F3D3026',
    backgroundColor: 'transparent',
  };

  return (
    <Container.Page>
      {/* STORY CAROUSEL SECTION */}
      <Container.Box containerClassName="h-[75%]">
        <StoryCarousel style={style} screens={screens} />
      </Container.Box>

      {/* ACTION BUTTONS SECTION */}
      <Container.Box containerClassName="px">
        <CustomButton
          label={'Get started'}
          onPress={() => {
            present();
            // PUSH('/SIGN-UP');
          }}
        />
        <CustomButton.Secondary
          label={'Skip sign in'}
          onPress={() => {
            setIsFirstTime(false);
            replace('/(main)');
          }}
        />
      </Container.Box>
      {/* USER TYPE SELECTION MODAL */}
      <Modal ref={ref} title="Are you an individual or a business owner?">
        <View className="mt-2 px-5">
          {userType.map((e, i) => (
            <View key={i.toString()} className="py-5">
              <Radio.Root
                checked={e.value === selectedRole}
                onChange={() => setSelectedRole(e.value as UserType)}
                accessibilityLabel="radio button"
                className="justify-between  pb-2"
              >
                <Radio.Label text={e.name} className="text-[16px]" />
                <Radio.Icon checked={selectedRole === e.value} />
              </Radio.Root>
              {/* DIVIDER LINE BETWEEN RADIO OPTIONS */}
              {i === 0 && <View className="top-4 h-px bg-[#1212121A]" />}
            </View>
          ))}
          <CustomButton
            label={'Continue'}
            onPress={() => {
              setIsFirstTime(false);
              push(`/sign-up?role=${selectedRole}`);
              dismiss();
            }}
          />
        </View>
      </Modal>
    </Container.Page>
  );
}
