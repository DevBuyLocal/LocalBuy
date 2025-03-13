import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React from 'react';

import { useGetManufacturers } from '@/api/manufacturers';
import { useGetCategories } from '@/api/product/use-get-categories';
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

  const { push } = useRouter();
  const { clearFilters } = useUtility(UtilitySelector);

  const { data: cate } = useGetCategories()();

  const categories = cate?.data || [];

  const { data } = useGetManufacturers({ limit: 10, page: 1 })();
  const brands = React.useMemo(() => data?.pages[0]?.data || [], [data]);

  return (
    <Modal ref={ref} snapPoints={['100%']}>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Container.Page
          // containerClassName="pt-10"
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
            {brands.map((e, i) => (
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
            {categories.map((e, i) => (
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
          disabled={brandIndex === null && catIndex === null}
          onPress={() => {
            //TODO: apply filters
            const selectedCategory = categories[catIndex!]?.id;
            const selectedBrand = brands[brandIndex!]?.id;
            if (selectedCategory && selectedBrand) {
              push(
                `/all-products?category=${selectedCategory}&brand=${selectedBrand}`
              );
            }

            dismiss();
          }}
        />
      </View>
    </Modal>
  );
});

export default FilterModal;
