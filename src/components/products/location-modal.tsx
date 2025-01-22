import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';

import { useUtility, UtilitySelector } from '@/lib/utility';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Modal, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
};

const LocationModal = React.forwardRef<any, Props>(({ dismiss }, ref) => {
  const [brandIndex, setBrandIndex] = React.useState<number | null>(null);
  const [catIndex, setCatIndex] = React.useState<number | null>(null);
  const { clearFilters } = useUtility(UtilitySelector);
  const brandsFilters = [
    { id: 'hhsgwnw', name: 'UAC' },
    { id: 'siwjwks', name: 'Erisco' },
    { id: 'djdkjss', name: 'Dangote' },
    { id: 'dkieiee', name: 'Marina' },
  ];
  const catFilters = [
    { id: 'sksks', name: 'All categories' },
    { id: 'siejie', name: 'Home' },
    { id: 'rdvcdv', name: 'Food' },
    { id: 'vfyyrr', name: 'Furniture' },
    { id: 'pppaom', name: 'Clothing' },
  ];

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
