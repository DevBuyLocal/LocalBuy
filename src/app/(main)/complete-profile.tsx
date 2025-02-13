import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { View } from 'moti';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useSavePreference } from '@/api/user/use-save-preferences';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Pressable, Text } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

const prefs = [
  { item: 'Farmers market' },
  { item: 'Drinks' },
  { item: 'Groceries' },
  { item: 'Fruit & vegetables' },
  { item: 'Cleaning materials' },
  { item: 'Foodstuffs' },
  { item: 'Wine & spirits' },
  { item: 'Beauty & care' },
  { item: 'Insecticides' },
  { item: 'Fishes & raw meats' },
  { item: 'Milk & proteins' },
  { item: 'Water' },
];

// eslint-disable-next-line max-lines-per-function
function CompleteProfile() {
  const { back } = useRouter();
  const { setSuccess, setError, setLoading } = useLoader();
  const [page, setPage] = React.useState<number>(0);
  const [selectedPref, setSelectedPref] = React.useState<string[]>([]);

  const { mutate } = useSavePreference({
    onSuccess: () => {
      setPage(page + 1);
      setSuccess('Preferences saved');
    },
    onError: () => {
      setError('Error saving preferences');
    },
    onSettled() {
      setLoading(false);
    },
  });

  function Pages() {
    switch (page) {
      case 0:
        return (
          <InputView>
            <Text className="mt-2 text-[25px] font-bold">
              Enter Your Phone Number
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              Provide your mobile number
            </Text>
            <CustomInput placeholder="Phone number" />
            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                label="Continue"
                onPress={() => {
                  setPage(page + 1);
                }}
              />
            </View>
          </InputView>
        );
      case 1:
        return (
          <InputView>
            <Text className="mt-2 text-[25px] font-bold">Business Details</Text>
            <Text className="mt-2 text-[16px] opacity-75">
              Enter your business details as in your official documents
            </Text>
            <CustomInput placeholder="Full name" />
            <CustomInput placeholder="Business name" />
            <CustomInput placeholder="Business address" />
            <CustomInput placeholder="CAC number (optional)" />
            <CustomInput placeholder="How did you hear about us" />
            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                label="Continue"
                onPress={() => {
                  setPage(page + 1);
                }}
              />
            </View>
          </InputView>
        );
      case 2:
        return (
          <InputView>
            <Text className="mt-2 text-[25px] font-bold">
              Customize your shopping experience
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              We'll create a personalized shopping experience based on your
              interest.
            </Text>
            <View className="mt-5 flex-row flex-wrap gap-3">
              {prefs.map((e, i) => (
                <Pressable
                  key={i.toString()}
                  className={twMerge(
                    'py-3 px-5 rounded-full border border-gray-200',
                    selectedPref.includes(e.item) &&
                      'border-primaryText bg-[#FFF5E1]'
                  )}
                  onPress={() => {
                    setSelectedPref((prev) => {
                      if (prev.includes(e.item)) {
                        return prev.filter((el) => el !== e.item);
                      } else {
                        return [...prev, e.item];
                      }
                    });
                  }}
                >
                  <View className="flex-row gap-2">
                    {selectedPref.includes(e.item) && (
                      <Feather name="check" size={24} color="black" />
                    )}
                    <Text className="text-[16px]">{e.item}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                label="Save"
                disabled={!selectedPref.length}
                onPress={() => {
                  setLoading(true);
                  mutate({
                    preference: selectedPref,
                  });
                }}
              />
              <CustomButton.Secondary
                label="Skip"
                onPress={() => {
                  setPage(page + 1);
                }}
              />
            </View>
          </InputView>
        );
      case 3:
        return (
          <InputView>
            <Text className="mt-2 text-[25px] font-bold">
              Turn on notifications?
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              Get timely alerts and notifications. We’ll notify you when:
            </Text>

            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                label="Turn on notifications"
                onPress={() => {
                  setPage(page + 1);
                }}
              />
              <CustomButton.Secondary
                label="Remind me later"
                onPress={() => {
                  setPage(page + 1);
                }}
              />
            </View>
          </InputView>
        );
      case 4:
        return <Text>main</Text>;
      default:
        return <Text>main</Text>;
    }
  }

  return (
    <Container.Page
      headerTitle="Complete Profile"
      showHeader
      backPress={() => {
        if (page < 1) {
          back();
        } else {
          setPage(page - 1);
        }
      }}
    >
      {Pages()}
    </Container.Page>
  );
}

export default CompleteProfile;
