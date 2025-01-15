import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import AccountItem from '@/components/account/account-item';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ScrollView, Text, View } from '@/components/ui';

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

const Default = ({
  setPage,
}: {
  setPage: React.Dispatch<
    React.SetStateAction<
      'default' | 'edit' | 'password' | 'payment' | 'shipping'
    >
  >;
}) => {
  const defaultList = [
    {
      label: 'Edit profile',
      icon: <Feather name="edit-3" size={24} color="black" />,
      onPress: () => {
        setPage('edit');
      },
    },
    {
      label: 'Change password',
      icon: <MaterialIcons name="change-circle" size={24} color="black" />,
      onPress: () => {
        setPage('password');
      },
    },
    {
      label: 'Manage payment methods',
      icon: <MaterialIcons name="payments" size={24} color="black" />,
      onPress: () => {
        // setPage('payment');
      },
    },
    {
      label: 'Edit shipping address',
      icon: <FontAwesome6 name="book-bookmark" size={24} color="black" />,
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
const Edit = () => {
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

        <CustomInput placeholder="Full name" />
        <CustomInput placeholder="Email address" keyboardType="email-address" />
        <CustomInput placeholder="Phone number" keyboardType="number-pad" />
        <View className="absolute bottom-[120px] w-full">
          <CustomButton label="Update" />
        </View>
      </ScrollView>
    </AvoidSoftInputView>
  );
};

const Password = () => {
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

        <CustomInput placeholder="Current password" isPassword />
        <CustomInput placeholder="Enter new password" isPassword />
        <CustomInput placeholder="Confirm new password" isPassword />
        <View className="absolute bottom-[120px] w-full">
          <CustomButton label="Update" />
        </View>
      </ScrollView>
    </AvoidSoftInputView>
  );
};
const Payment = () => {
  return (
    <Container.Box>
      <Text>payment</Text>
    </Container.Box>
  );
};
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
