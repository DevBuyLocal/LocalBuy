import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { View } from 'moti';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useGetUser, useUpdateUser } from '@/api';
import { useGetCategories } from '@/api/product/use-get-categories';
import { useSavePreference } from '@/api/user/use-save-preferences';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import InputView from '@/components/general/input-view';
import { Image, Pressable, ScrollView, Text } from '@/components/ui';
import { UserType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';

// eslint-disable-next-line max-lines-per-function
function CompleteProfile() {
  const { back, replace } = useRouter();

  // const { user } = useAuth();

  const { data: categories } = useGetCategories()();

  const { data: user, refetch } = useGetUser();
  const isBusiness = user?.type === UserType.Business;
  const { setSuccess, setError, setLoading, loading } = useLoader({
    showLoadingPage: false,
  });
  const [page, setPage] = React.useState<number>(0);
  const [phone, setPhone] = React.useState<string>(
    user?.profile?.deliveryPhone || ''
  );
  const [fullName, setFullName] = React.useState(user?.profile?.fullName || '');
  const [howDid, setHowDid] = React.useState(
    user?.profile?.howDidYouHear || ''
  );
  const [selectedPref, setSelectedPref] = React.useState<string[]>([]);
  const { mutate: mutateUpdate } = useUpdateUser({
    onSuccess: () => {
      setPage(page + 1);
      setSuccess('Successfully updated');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });

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

  // eslint-disable-next-line max-lines-per-function
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
            <CustomInput
              placeholder="eg. 08012121212"
              keyboardType="number-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                disabled={!phone}
                label="Continue"
                loading={loading}
                onPress={() => {
                  if (
                    phone === user?.profile?.deliveryPhone ||
                    phone === user?.profile?.businessPhone
                  ) {
                    setPage(page + 1);
                    return;
                  }
                  setLoading(true);
                  mutateUpdate({
                    deliveryPhone: phone,
                  });
                }}
              />
            </View>
          </InputView>
        );
      case 1:
        // if (!isBusiness) {
        //   setPage(page + 1);
        // }
        return !isBusiness ? (
          <InputView>
            <Text className="mt-2 text-[25px] font-bold">
              Enter Your Details
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              Enter your correct details.
            </Text>
            <CustomInput
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
            />
            <CustomInput
              placeholder="eg. 08012121212"
              keyboardType="number-pad"
              maxLength={11}
              value={phone}
              onChangeText={setPhone}
            />
            <CustomInput
              placeholder="How did you hear about us (eg.social media)"
              value={howDid}
              onChangeText={setHowDid}
            />
            <View className="absolute bottom-[120px] w-full">
              <CustomButton
                label="Continue"
                disabled={!fullName || !phone}
                loading={loading}
                onPress={() => {
                  if (
                    fullName === user?.profile?.fullName &&
                    phone === user?.profile?.deliveryPhone &&
                    howDid === user?.profile?.howDidYouHear
                  ) {
                    setPage(page + 1);
                    return;
                  }
                  setLoading(true);
                  mutateUpdate({
                    deliveryPhone: phone,
                    fullName: fullName,
                    howDidYouFindUs: howDid,
                  });
                }}
              />
            </View>
          </InputView>
        ) : (
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
          <View className="flex-1 px-5">
            <Text className="mt-2 text-[25px] font-bold">
              Customize your shopping experience
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              We'll create a personalized shopping experience based on your
              interest.
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-16"
            >
              <View className="mt-5 flex-row flex-wrap gap-3">
                {categories?.data?.map((e, i) => (
                  <Pressable
                    key={i.toString()}
                    className={twMerge(
                      'py-3 px-5 rounded-full border border-gray-200',
                      selectedPref.includes(e.name) &&
                        'border-primaryText bg-[#FFF5E1]'
                    )}
                    onPress={() => {
                      setSelectedPref((prev) => {
                        if (prev.includes(e.name)) {
                          return prev.filter((el) => el !== e.name);
                        } else {
                          return [...prev, e.name];
                        }
                      });
                    }}
                  >
                    <View className="flex-row gap-2">
                      {selectedPref.includes(e.name) && (
                        <Feather name="check" size={24} color="black" />
                      )}
                      <Text className="text-[16px]">{e.name}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View className="bottom-[20px] w-full">
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
          </View>
        );
      // case 3:
      //   return (
      //     <InputView>
      //       <Text className="mt-2 text-[25px] font-bold">
      //         Turn on notifications?
      //       </Text>
      //       <Text className="mt-2 text-[16px] opacity-75">
      //         Get timely alerts and notifications. We’ll notify you when:
      //       </Text>

      //       <View className="absolute bottom-[120px] w-full">
      //         <CustomButton
      //           label="Turn on notifications"
      //           onPress={() => {
      //             setPage(page + 1);
      //           }}
      //         />
      //         <CustomButton.Secondary
      //           label="Remind me later"
      //           onPress={() => {
      //             setPage(page + 1);
      //           }}
      //         />
      //       </View>
      //     </InputView>
      //   );
      case 3:
        return (
          <Container.Box containerClassName="flex-1">
            <View className="mt-10 flex-1 items-center">
              <Image
                source={require('../../../assets/images/love.png')}
                className="size-[251px]"
              />
              <Text className="text-center text-[24px] font-bold">
                You’re all set! Thanks for joining BuyLocal.
              </Text>
              <Text className="my-5 w-[90%] text-center text-[16px] text-[#121212] opacity-75">
                Start exploring our marketplace to order food items, groceries,
                and more!
              </Text>
            </View>
            <CustomButton
              label="Done"
              onPress={async () => {
                await refetch();
                replace('/');
              }}
              containerClassname="bottom-10"
            />
          </Container.Box>
        );
      default:
        return <Text>main</Text>;
    }
  }

  return (
    <Container.Page
      headerTitle="Complete Profile"
      showHeader={page !== 3}
      backPress={() => {
        if (page < 1) {
          back();
        } else {
          if (!isBusiness) {
            setPage(page - 1);
            return;
          }
          setPage(page - 1);
        }
      }}
    >
      {Pages()}
    </Container.Page>
  );
}

export default CompleteProfile;
