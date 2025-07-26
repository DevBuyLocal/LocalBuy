import React from 'react';
import { Pressable, Text, TextInput, View, Modal, ScrollView } from 'react-native';

import { useGetUser } from '@/api';
import { useUpdateUser } from '@/api/user/use-update-user';
import CustomButton from '@/components/general/custom-button';
import { colors, SafeAreaView } from '@/components/ui';
import { validateBusinessAddress } from '@/lib/utils';

interface LocationModalProps {
  onAddressSaved?: (address: string) => void;
  mode?: 'add' | 'select' | 'edit';
  initialAddress?: string;
  visible?: boolean;
  onDismiss?: () => void;
}

export default function LocationModal({ 
  onAddressSaved, 
  mode = 'add',
  initialAddress = '',
  visible = false,
  onDismiss
}: LocationModalProps) {
  const { data: user } = useGetUser();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [address, setAddress] = React.useState(initialAddress);
  const [addressError, setAddressError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(mode === 'edit');

  // Debug modal props
  console.log('📍 LocationModal Debug:', {
    mode,
    initialAddress,
    visible,
    isEditing,
    userType: user?.type,
    userProfile: user?.profile,
    defaultAddress: user?.defaultAddress
  });

  React.useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  React.useEffect(() => {
    if (visible) {
      console.log('📍 Opening address modal...');
      // Set the initial address when modal opens
      if (initialAddress) {
        setAddress(initialAddress);
      }
      // If in edit mode, show editing interface immediately
      if (mode === 'edit') {
        setIsEditing(true);
      }
    } else {
      console.log('📍 Closing address modal...');
      // Reset to selection mode when modal closes
      setIsEditing(false);
    }
  }, [visible, initialAddress, mode]);

  const handleDismiss = () => {
    console.log('📍 Dismissing address modal...');
    onDismiss?.();
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    if (addressError) {
      const error = validateBusinessAddress(text);
      setAddressError(error);
    }
  };

  const handleSave = () => {
    const error = validateBusinessAddress(address);
    setAddressError(error);

    if (!error) {
      const updateData = {
        ...(user?.type === 'individual' 
          ? { address: address.trim() }
          : { businessAddress: address.trim() }
        ),
      };

      updateUser(updateData, {
        onSuccess: () => {
          handleDismiss();
          onAddressSaved?.(address.trim());
        },
        onError: (error) => {
          console.error('Failed to update address:', error);
          setAddressError('Failed to save address. Please try again.');
        },
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAddress('');
    setAddressError('');
  };

  const currentAddress = user?.type === 'individual' 
    ? user?.profile?.address 
    : user?.profile?.businessAddress;

  const savedAddresses = React.useMemo(() => {
    const addresses = [];
    if (currentAddress) {
      addresses.push({ id: 'current', address: currentAddress, isDefault: true });
    }
    if (user?.defaultAddress?.addressLine1 && user.defaultAddress.addressLine1 !== currentAddress) {
      addresses.push({ id: 'default', address: user.defaultAddress.addressLine1, isDefault: false });
    }
    return addresses;
  }, [currentAddress, user?.defaultAddress?.addressLine1]);

  const renderAddressSelection = () => (
    <View className="p-5">
      <Text className="mb-4 text-lg font-semibold">Select Delivery Address</Text>
      
      {savedAddresses.length > 0 && (
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-600">Saved Addresses</Text>
          {savedAddresses.map((address, _index) => (
            <Pressable
              key={address.id}
              className="mb-2 rounded-lg border border-gray-200 bg-white p-3"
              onPress={() => {
                onAddressSaved?.(address.address);
                handleDismiss();
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium">{address.address}</Text>
                  {address.isDefault && (
                    <Text className="text-xs text-blue-600">Default Address</Text>
                  )}
                </View>
                <Text className="text-xs text-gray-500">Select</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-600">Add New Address</Text>
        <Pressable
          className="rounded-lg border border-gray-200 bg-white p-3"
          onPress={() => setIsEditing(true)}
        >
          <Text className="text-center text-blue-600">+ Add New Address</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderAddressEdit = () => (
    <View className="p-5">
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-600">
          {user?.type === 'individual' ? 'Delivery Address' : 'Business Address'}
        </Text>
        <TextInput
          value={address}
          onChangeText={handleAddressChange}
          placeholder={`Enter your ${user?.type === 'individual' ? 'delivery' : 'business'} address`}
          className="rounded-lg border border-gray-200 bg-white p-3 text-base"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          autoFocus={true}
        />
        {addressError && (
          <Text className="mt-1 text-xs text-red-500">{addressError}</Text>
        )}
      </View>

      <View className="flex-row space-x-3">
        <CustomButton.Secondary
          label="Cancel"
          onPress={mode === 'edit' ? handleCancel : handleDismiss}
          containerClassname="flex-1 mr-1"
        />
        <CustomButton
          label="Save"
          onPress={handleSave}
          loading={isPending}
          containerClassname="flex-1 ml-1"
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={handleDismiss}
      transparent
      animationType="slide"
    >
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView className="bg-white rounded-t-3xl max-h-[80%]">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <View className="flex-row items-center space-x-2">
              {isEditing && mode === 'edit' && (
                <Pressable
                  onPress={() => setIsEditing(false)}
                  className="rounded-lg bg-blue-50 px-3 py-1 mr-2"
                >
                  <Text className="text-sm text-blue-600">← Back</Text>
                </Pressable>
              )}
              <Text className="text-lg font-semibold">
                {isEditing ? 'Edit Address' : 'Select Address'}
              </Text>
            </View>
            <Pressable
              onPress={handleDismiss}
              className="rounded-full bg-gray-100 p-2"
            >
              <Text className="text-gray-600 font-semibold">✕</Text>
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {isEditing ? renderAddressEdit() : renderAddressSelection()}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
