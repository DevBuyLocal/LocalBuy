import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import { useUpdateUser } from '@/api';
import { useResetPassword } from '@/api/auth/use-reset-password';
import { useUpdatePassword } from '@/api/auth/use-update-password';
import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import CountdownTimer from '@/components/general/count-down';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ScrollView, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { Env } from '@/lib/env';
import { useLoader } from '@/lib/hooks/general/use-loader';

/* MAIN ACCOUNT INFORMATION COMPONENT - HANDLES USER PROFILE, PASSWORD, PAYMENT AND SHIPPING DETAILS */
function AccountInfo() {
  const { back } = useRouter();
  const [page, setPage] = React.useState<
    'default' | 'edit' | 'password' | 'payment' | 'shipping'
  >('default');

  function AccountPages() {
    switch (page) {
      case 'edit':
        return <Edit />;
      case 'password':
        return <Password />;
      case 'payment':
        return <Payment />;
      case 'shipping':
        return <Shipping />;
      case 'default':
        return <Default setPage={setPage} />;
      default:
        return <></>;
    }
  }
  return (
    <Container.Page
      containerClassName="mt-2"
      showHeader
      headerTitle={page === 'default' ? 'Account information' : page}
      backPress={() => {
        if (page === 'default') {
          back();
        } else {
          setPage('default');
        }
      }}
    >
      {AccountPages()}
    </Container.Page>
  );
}

/* DEFAULT VIEW - DISPLAYS LIST OF ACCOUNT MANAGEMENT OPTIONS */
const Default = ({
  setPage,
}: {
  setPage: React.Dispatch<
    React.SetStateAction<
      'default' | 'edit' | 'password' | 'payment' | 'shipping'
    >
  >;
}) => {
  const { colorScheme } = useColorScheme();
  const defaultList = [
    {
      label: 'Edit profile',
      icon: (
        <Feather
          name="edit-3"
          size={24}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      onPress: () => {
        setPage('edit');
      },
    },
    {
      label: 'Change password',
      icon: (
        <MaterialIcons
          name="change-circle"
          size={24}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      onPress: () => {
        setPage('password');
      },
    },
    {
      label: 'Manage payment methods',
      icon: (
        <MaterialIcons
          name="payments"
          size={24}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      onPress: () => {
        // setPage('payment');
      },
    },
    {
      label: 'Edit shipping address',
      icon: (
        <FontAwesome6
          name="book-bookmark"
          size={24}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      onPress: () => {
        setPage('shipping');
      },
    },
  ];
  return (
    <Container.Box>
      {defaultList.map((e, i) => (
        <AccountItem
          label={e.label}
          icon={e.icon}
          onPress={e.onPress}
          key={i.toString()}
        />
      ))}
    </Container.Box>
  );
};

/* EDIT PROFILE SECTION - ALLOWS USER TO UPDATE PERSONAL INFORMATION */
const Edit = () => {
  const { setSuccess, setLoading, setError } = useLoader({});
  const { user } = useAuth();

  const [details, setDetails] = React.useState({
    fullName: user?.profile?.fullName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
  });

  const { mutate: mutateUpdate } = useUpdateUser({
    onSuccess: () => {
      setSuccess('Phone number updated');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });

  // const { loading, setLoading } = useLoader();

  // React.useEffect(() => {
  //   setLoading(true);
  // }, []);
  return (
    <AvoidSoftInputView>
      <ScrollView
        className="h-full px-5"
        contentContainerClassName="flex-1 h-full"
      >
        <View className="my-5 size-[90px] items-center justify-center self-center rounded-full border border-primaryText bg-[#EC9F0130]">
          <Text className="text-[50px] font-bold color-primaryText">D</Text>
        </View>

        <CustomInput
          placeholder="Full name"
          value={details?.fullName}
          onChangeText={(e) => {
            setDetails({ ...details, fullName: e });
          }}
        />
        <CustomInput
          placeholder="Email address"
          keyboardType="email-address"
          value={details?.email}
          disabled
          onPress={() => {}}
        />
        <CustomInput
          placeholder="Phone number"
          keyboardType="number-pad"
          value={details?.phoneNumber}
          onChangeText={(e) => {
            setDetails({ ...details, phoneNumber: e });
          }}
        />
        <View className="absolute bottom-[120px] w-full">
          <CustomButton
            label="Update"
            onPress={() => {
              setLoading(true);
              mutateUpdate({
                phoneNumber: details?.phoneNumber,
                fullName: details?.fullName,
              });
            }}
          />
        </View>
      </ScrollView>
    </AvoidSoftInputView>
  );
};

/* PASSWORD MANAGEMENT SECTION - HANDLES PASSWORD UPDATES */
const Password = () => {
  const { setSuccess, setLoading, setError } = useLoader({});
  const { user } = useAuth();
  const { back } = useRouter();
  const [pass, setPass] = React.useState({ password: '', confirmPassword: '' });
  const [code, setCode] = React.useState('');

  const { mutate } = useResetPassword({
    onSuccess: (data) => {
      setSuccess(data?.message);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });

  const { mutate: mutateUpdate } = useUpdatePassword({
    onSuccess: (data) => {
      setSuccess(data?.message);
      setPass({ password: '', confirmPassword: '' });
      setCode('');
      back();
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });
  function SendCode() {
    if (!user?.email) return;
    setLoading(true);
    mutate({
      email: user?.email,
    });
  }
  function UpdatePassword() {
    if (!user?.email) return;
    setLoading(true);
    mutateUpdate({
      email: user?.email,
      code,
      password: pass?.password,
      confirmPassword: pass?.confirmPassword,
    });
  }

  return (
    <AvoidSoftInputView>
      <ScrollView
        className="h-full px-5"
        contentContainerClassName="flex-1 h-full"
      >
        <Text className="mt-5 text-[26px] font-medium">
          Update your password
        </Text>
        <Text className="my-3 text-[16px] color-[#030C0ABF]">
          Enter a new password to keep your account secure.
        </Text>

        <CustomInput
          placeholder="Enter new password"
          isPassword
          value={pass?.password}
          onChangeText={(e) => {
            setPass({ ...pass, password: e });
          }}
        />
        <CustomInput
          placeholder="Confirm new password"
          isPassword
          value={pass?.confirmPassword}
          onChangeText={(e) => {
            setPass({ ...pass, confirmPassword: e });
          }}
        />
        <CountdownTimer
          countFrom={Env.APP_ENV === 'development' ? 5 : 60}
          onCountdownComplete={() => {}}
          resend={SendCode}
          text1="Click to receive code"
          text2="Send"
        />

        <CustomInput
          placeholder="Code"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />

        <View className="absolute bottom-[120px] w-full">
          <CustomButton
            label="Update"
            disabled={code.length < 6 || pass.password !== pass.confirmPassword}
            onPress={UpdatePassword}
          />
        </View>
      </ScrollView>
    </AvoidSoftInputView>
  );
};

/* PAYMENT METHODS SECTION - MANAGES USER PAYMENT OPTIONS */
const Payment = () => {
  return (
    <Container.Box>
      <Text>payment</Text>
    </Container.Box>
  );
};

/* SHIPPING ADDRESS SECTION - HANDLES USER DELIVERY INFORMATION */
const Shipping = () => {
  return (
    <AvoidSoftInputView>
      <ScrollView
        className="h-full px-5"
        contentContainerClassName="flex-1 h-full"
      >
        <Text className="mt-5 text-[26px] font-medium">
          Update Shipping Address
        </Text>
        <Text className="my-3 text-[16px] color-[#030C0ABF]">
          Make sure your address is up-to-date so we can deliver your orders to
          the right place.
        </Text>

        <CustomInput placeholder="Address" />
        <CustomInput placeholder="Nearest landmark" />
        <View className="absolute bottom-[120px] w-full">
          <CustomButton label="Update" />
        </View>
      </ScrollView>
    </AvoidSoftInputView>
  );
};

export default AccountInfo;
