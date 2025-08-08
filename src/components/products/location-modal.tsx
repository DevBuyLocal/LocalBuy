import React, { useEffect, useCallback, useMemo } from 'react';
import { BackHandler, TextInput } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useAddAddress } from '@/api/auth/use-add-address';
import { useAuth } from '@/lib/auth';
import { useLoader } from '@/lib/hooks/general/use-loader';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { IS_IOS, Modal, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
  refetch: any;
  onAddressSaved?: (address: string) => void;
  initialAddress?: string;
  onDismiss?: () => void;
};

const LocationModal = React.forwardRef<any, Props>(
  ({ dismiss, refetch, onAddressSaved, initialAddress, onDismiss }, ref) => {
    const [address, setAddress] = React.useState(initialAddress || '');
    const { setLoading, loading, setSuccess, setError } = useLoader({
      showLoadingPage: false,
    });
    const { user } = useAuth();

    // Remove debug logging that might cause re-renders
    // React.useEffect(() => {
    //   console.log('📍 Address state changed:', address);
    // }, [address]);

    //prevent back press
    useEffect(() => {
      if (!IS_IOS) {
        const backAction = () => {
          if (onDismiss) {
            onDismiss();
          } else {
            dismiss();
          }
          return true; // Prevents default back behavior
        };

        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );

        return () => backHandler.remove();
      }
    }, [dismiss, onDismiss]);

    const { mutate: addAddress } = useAddAddress();

    const handleSave = () => {
      if (!address) return;
      setLoading(true);
      console.log('📍 Saving address:', address);
      
      // Get existing address data or use defaults
      const existingAddress = (user as any)?.defaultAddress || (user as any)?.address?.[0];
      
      addAddress(
        {
          addressLine1: address.trim(),
          addressLine2: existingAddress?.addressLine2 || '',
          city: existingAddress?.city || 'Lagos',
          stateProvince: existingAddress?.stateProvince || 'Lagos',
          postalCode: existingAddress?.postalCode || '100001',
          country: existingAddress?.country || 'Nigeria',
          phoneNumber: existingAddress?.phoneNumber || (user as any)?.profile?.deliveryPhone || '08000000000',
          addressType: 'SHIPPING',
        },
        {
          onSuccess: async (data) => {
            console.log('📍 Address update successful:', data);
            await refetch();
            setSuccess('Address updated successfully');
            
            // Call onAddressSaved if provided (for checkout page)
            if (onAddressSaved) {
              onAddressSaved(address.trim());
            }
            
            // Use onDismiss if provided, otherwise use dismiss
            if (onDismiss) {
              onDismiss();
            } else {
              dismiss();
            }
          },
          onError: (error: any) => {
            console.error('📍 Address update failed:', error);
            setError(error?.response?.data || 'Failed to update address');
          },
          onSettled: () => {
            setLoading(false);
          },
        }
      );
    };

    // Memoize the onChangeText handler to prevent re-renders
    const handleAddressChange = useCallback((text: string) => {
      setAddress(text);
    }, []);

    return (
      <Modal ref={ref} snapPoints={['100%']}>
        <Container.Page
          containerClassName={twMerge(IS_IOS && 'pt-5')}
          showHeader
          backPress={onDismiss || dismiss}
          headerTitle="Delivery location"
        >
          <Container.Box containerClassName="w-full">
            <Text className="mt-5 text-[18px]">Enter your delivery address</Text>

            <View className="mt-4">
              <TextInput
                placeholder="Enter your delivery address"
                placeholderTextColor="#12121280"
                value={address}
                onChangeText={handleAddressChange}
                editable={true}
                selectTextOnFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
                style={{
                  height: 48,
                  width: '100%',
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#12121233',
                  paddingHorizontal: 10,
                  fontSize: 16,
                  color: '#282828',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </View>
          </Container.Box>
        </Container.Page>
        <View className="mb-10 px-5">
          <CustomButton
            label="Save"
            disabled={!address}
            loading={loading}
            onPress={handleSave}
          />
        </View>
      </Modal>
    );
}
);

export default LocationModal;
