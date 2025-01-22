import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';

import { useUtility, UtilitySelector } from '@/lib/utility';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Modal, Radio, Text, View } from '../ui';

type Props = {
  dismiss: () => void;
};

const FilterModal = React.forwardRef<any, Props>(({ dismiss }, ref) => {
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
          headerTitle="Filter and sort"
        >
          <Container.Box>
            <Text className="my-5 text-[16px]">
              Get better item recommendations by setting up your shopping
              preferences.
            </Text>
            <Text className="mb-2 text-[18px] font-medium">
              Filter By Brand:
            </Text>
            {brandsFilters.map((e, i) => (
              <Radio.Root
                key={e?.id}
                checked={i === catIndex}
                onChange={() => setCatIndex(i)}
                accessibilityLabel="radio button"
                className="gap-2 py-2"
              >
                <Radio.Icon checked={i === catIndex} />
                <Radio.Label text={e.name} className="text-[16px]" />
              </Radio.Root>
            ))}
            <Text className="mb-2 mt-5 text-[18px] font-medium">
              Product Categories:
            </Text>
            {catFilters.map((e, i) => (
              <Radio.Root
                key={e?.id}
                checked={i === brandIndex}
                onChange={() => setBrandIndex(i)}
                accessibilityLabel="radio button"
                className="gap-2 py-2"
              >
                <Radio.Icon checked={i === brandIndex} />
                <Radio.Label text={e.name} className="text-[16px]" />
              </Radio.Root>
            ))}
          </Container.Box>
        </Container.Page>
      </BottomSheetScrollView>
      <View className="mb-10 flex-row items-center justify-between px-5">
        <Text
          className="text-[18px] font-medium underline"
          onPress={() => {
            setBrandIndex(null);
            setCatIndex(null);
            clearFilters();
            dismiss();
          }}
        >
          Clear all
        </Text>
        <CustomButton
          label="Apply"
          onPress={() => {
            //TODO: apply filters
            dismiss();
          }}
        />
      </View>
    </Modal>
  );
});

export default FilterModal;
