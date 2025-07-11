import { Env } from '@env';
import React, { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useUpdateUser } from '@/api';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { Modal, Pressable, Text, View } from '@/components/ui';
import { IS_IOS } from '@/components/ui/utils';
import { setUser, useAuth } from '@/lib/auth';
import { UserType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';

// Dynamic import with error handling
let GooglePlacesAutocomplete: any = null;
try {
  GooglePlacesAutocomplete =
    require('react-native-google-places-autocomplete').GooglePlacesAutocomplete;
} catch (error) {
  console.warn(
    'GooglePlacesAutocomplete not available, falling back to test mode:',
    error
  );
}

type Props = {
  dismiss: () => void;
  refetch: () => void; // Add refetch function to force UI update
};

// Mock addresses for test mode
const mockAddresses = [
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Port Harcourt, Nigeria',
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Benin City, Nigeria',
  'Kaduna, Nigeria',
  'Jos, Nigeria',
];

const LocationModal = React.forwardRef<any, Props>(
  ({ dismiss, refetch }, ref) => {
    const [address, setAddress] = React.useState('');
    const [showMockAddresses, setShowMockAddresses] = React.useState(false);
    const [forceTestMode, setForceTestMode] = React.useState(false);
    const { setLoading, loading, setSuccess, setError } = useLoader({
      showLoadingPage: false,
    });
    const { user } = useAuth();

    // Check if we should use test mode
    const shouldUseTestMode =
      Env.TEST_MODE === 'true' || !GooglePlacesAutocomplete || forceTestMode;

    //prevent back press
    useEffect(() => {
      if (!IS_IOS) {
        const backAction = () => {
          dismiss();
          return true; // Prevents default back behavior
        };

        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );

        return () => backHandler.remove();
      }
    }, [dismiss]);

    const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateUser({
      onSuccess: (data) => {
        console.log('🚀 ~ LocationModal ~ Address update successful:', data);

        // Check the address based on user type
        const savedAddress =
          user?.type === UserType.Business
            ? data.profile?.businessAddress
            : data.profile?.address;

        console.log('🚀 ~ LocationModal ~ Updated address:', savedAddress);

        // Force update the auth store directly
        setUser(data);

        // Force refetch of user data to update the UI
        console.log('🚀 ~ LocationModal ~ Calling refetch to update UI...');
        refetch();

        setLoading(false);
        setSuccess('Address updated successfully!');
        dismiss();

        // Force a small delay to ensure the UI updates
        setTimeout(() => {
          console.log(
            '🚀 ~ LocationModal ~ Modal dismissed, UI should update now'
          );
        }, 100);
      },
      onError: (error) => {
        console.error('🚀 ~ LocationModal ~ Address update failed:', error);
        setError('Failed to update address. Please try again.');
        setLoading(false);
      },
    });

    const handleSave = () => {
      if (!address.trim()) {
        setError('Please enter a valid address');
        return;
      }

      setLoading(true);

      // Determine the correct field to update based on user type
      const updateData =
        user?.type === UserType.Business
          ? { businessAddress: address.trim() }
          : { address: address.trim() };

      console.log('🚀 ~ LocationModal ~ Saving address:', updateData);
      console.log('🚀 ~ LocationModal ~ User type:', user?.type);
      console.log('🚀 ~ LocationModal ~ Current profile:', user?.profile);

      mutateUpdate(updateData);
    };

    const handleAddressSelect = (selectedAddress: string) => {
      setAddress(selectedAddress);
      setShowMockAddresses(false);
    };

    const handleManualInput = () => {
      Alert.prompt(
        'Enter Address',
        'Please enter your delivery address',
        (text) => {
          if (text) {
            setAddress(text);
          }
        },
        'plain-text',
        address
      );
    };

    // Pre-populate with existing address if available
    React.useEffect(() => {
      if (user?.profile) {
        const existingAddress =
          user.type === UserType.Business
            ? user.profile.businessAddress
            : user.profile.address;
        if (existingAddress) {
          setAddress(existingAddress);
        }
      }
    }, [user?.profile, user?.type]);

    return (
      <Modal ref={ref} snapPoints={['100%']}>
        <Container.Page
          containerClassName={twMerge(IS_IOS && 'pt-5')}
          showHeader
          backPress={dismiss}
          headerTitle="Delivery location"
        >
          <Container.Box containerClassName="w-full">
            <Text className="mt-5 text-[18px]">Search and select location</Text>

            {shouldUseTestMode ? (
              // Test mode - use mock addresses
              <View className="mt-4">
                <CustomInput
                  placeholder="Enter your location"
                  value={address}
                  onChangeText={setAddress}
                  onPress={handleManualInput}
                />

                <View className="mt-4 flex-row justify-between">
                  <CustomButton
                    label="Choose from List"
                    onPress={() => setShowMockAddresses(!showMockAddresses)}
                    containerClassname="flex-1 mr-2"
                  />
                  <CustomButton
                    label="Enter Manually"
                    onPress={handleManualInput}
                    containerClassname="flex-1 ml-2"
                  />
                </View>

                {showMockAddresses && (
                  <View className="mt-4 max-h-64">
                    <Text className="mb-2 text-sm font-medium">
                      Select a location:
                    </Text>
                    {mockAddresses.map((mockAddress, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleAddressSelect(mockAddress)}
                        className="border-b border-gray-200 py-3"
                      >
                        <Text className="text-base">{mockAddress}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            ) : GooglePlacesAutocomplete ? (
              // Production mode - use Google Places API
              <GooglePlacesAutocomplete
                placeholder="Enter your location"
                onPress={(data: any) => {
                  setAddress(data.description);
                  // 'details' is provided when fetchDetails = true
                }}
                // fetchDetails
                debounce={300}
                // currentLocation
                query={{
                  key: 'AIzaSyD2KUOor40I0MWjU8JTbza1CdVjsOWBQqE',
                  language: 'en',
                  components: 'country:ng',
                }}
                suppressDefaultStyles
                styles={{
                  container: {
                    width: '100%',
                  },
                  powered: {
                    opacity: 0,
                  },
                  row: {
                    padding: 20,
                    height: 58,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EFEFF4',
                  },
                  description: {
                    fontSize: 15,
                    color: '#364B57',
                  },
                  predefinedPlacesDescription: {
                    color: '#364B57',
                  },
                  textInputContainer: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 58,
                    color: '#5d5d5d',
                    fontSize: 16,
                    borderRadius: 16,
                    backgroundColor: '#F2F5F8',
                    borderColor: '#F2F5F8',
                    borderWidth: 1,
                    paddingHorizontal: 20,
                  },
                  listView: {
                    top: 10,
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  },
                }}
              />
            ) : (
              // Fallback to manual input if Google Places is not available
              <View className="mt-4">
                <Text className="mb-2 text-sm text-gray-600">
                  Google Places is not available. Please enter your address
                  manually.
                </Text>
                <CustomInput
                  placeholder="Enter your location manually"
                  value={address}
                  onChangeText={setAddress}
                />
                <CustomButton
                  label="Use Mock Addresses"
                  onPress={() => setForceTestMode(true)}
                  containerClassname="mt-4"
                />
              </View>
            )}
          </Container.Box>
        </Container.Page>
        <View className="mb-10 px-5">
          <CustomButton
            label="Save"
            disabled={!address.trim()}
            loading={loading || isUpdating}
            onPress={handleSave}
          />
        </View>
      </Modal>
    );
  }
);

export default LocationModal;
