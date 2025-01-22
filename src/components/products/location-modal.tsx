import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Modal, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
};

const LocationModal = React.forwardRef<any, Props>(({ dismiss }, ref) => {
  return (
    <Modal ref={ref} snapPoints={['100%']}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Container.Page
          containerClassName="pt-10"
          showHeader
          backPress={dismiss}
          headerTitle="Delivery location"
        >
          <Container.Box>
            <Text className="my-5 text-[16px]">Search and select location</Text>
          </Container.Box>
        </Container.Page>
      </BottomSheetScrollView>
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
