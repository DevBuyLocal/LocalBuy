import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { twMerge } from 'tailwind-merge';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import CustomInput from '../general/custom-input';
import { IS_IOS, Modal, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
};

const LocationModal = React.forwardRef<any, Props>(({ dismiss }, ref) => {
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
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            // fetchDetails
            debounce={800}
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
          onPress={() => {
            //TODO: apply filters
            dismiss();
          }}
        />
      </View>
    </Modal>
  );
});

export default LocationModal;
