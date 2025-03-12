import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { twMerge } from 'tailwind-merge';

import { useUpdateUser } from '@/api';
import { useLoader } from '@/lib/hooks/general/use-loader';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import CustomInput from '../general/custom-input';
import { IS_IOS, Modal, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
  refetch: any;
};

const LocationModal = React.forwardRef<any, Props>(
  ({ dismiss, refetch }, ref) => {
    const [address, setAddress] = React.useState('');
    const { setLoading, loading, setSuccess, setError } = useLoader({
      showLoadingPage: false,
    });
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

    const { mutate: mutateUpdate } = useUpdateUser({
      onSuccess: async () => {
        setSuccess('Address updated');
        await refetch();
        dismiss();
      },
      onError: (error) => {
        setError(error?.response?.data);
      },
      onSettled() {
        setLoading(false);
      },
    });

    const handleSave = () => {
      if (!address) return;
      setLoading(true);
      mutateUpdate({ address });
    };

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

            <GooglePlacesAutocomplete
              placeholder="Enter your location"
              onPress={(data, details = null) => {
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
                  borderBottomColor: '#E5E5E5',
                },
              }}
              textInputProps={{
                InputComp: CustomInput,
                isSearch: true,
                // containerClass: 'bg-[#F7F7F7] rounded-full w-full',
              }}
            />
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
