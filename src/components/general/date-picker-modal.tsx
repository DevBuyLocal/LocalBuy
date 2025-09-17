import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Modal, useModal, View, Text, Pressable } from '@/components/ui';

interface DatePickerModalProps {
  onSave: (date: string) => void;
  initialDate?: string;
  title?: string;
}

interface DatePickerModalRef {
  present: (initialDate?: string) => void;
  dismiss: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export const DatePickerModal = forwardRef<DatePickerModalRef, DatePickerModalProps>(({
  onSave,
  initialDate,
  title = "Enter birthday"
}, ref) => {
  const { ref: modalRef, present, dismiss } = useModal();
  
  // Layout constants for smooth, centered snapping
  const ITEM_HEIGHT = 50;
  const PICKER_HEIGHT = 200;
  const CENTER_PAD = (PICKER_HEIGHT - ITEM_HEIGHT) / 2; // 75
  
  // Generate years (1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  
  // Generate months
  const months = [
    { value: 1, name: 'JANUARY' },
    { value: 2, name: 'FEBRUARY' },
    { value: 3, name: 'MARCH' },
    { value: 4, name: 'APRIL' },
    { value: 5, name: 'MAY' },
    { value: 6, name: 'JUNE' },
    { value: 7, name: 'JULY' },
    { value: 8, name: 'AUGUST' },
    { value: 9, name: 'SEPTEMBER' },
    { value: 10, name: 'OCTOBER' },
    { value: 11, name: 'NOVEMBER' },
    { value: 12, name: 'DECEMBER' },
  ];

  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Parse initial date or set defaults
  const parseInitialDate = (dateStr?: string) => {
    if (dateStr && dateStr.trim()) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return {
          year: parseInt(parts[0]),
          month: parseInt(parts[1]),
          day: parseInt(parts[2])
        };
      }
    }
    return {
      year: 2000,
      month: 10,
      day: 1
    };
  };

  const [currentInitialDate, setCurrentInitialDate] = useState(initialDate);
  const initial = parseInitialDate(currentInitialDate);
  const [selectedYear, setSelectedYear] = useState(initial.year);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);
  const [selectedDay, setSelectedDay] = useState(initial.day);

  // Refs for ScrollViews
  const monthScrollRef = useRef<any>(null);
  const dayScrollRef = useRef<any>(null);
  const yearScrollRef = useRef<any>(null);

  // Expose modal controls
  useImperativeHandle(ref, () => ({
    present: (newInitialDate?: string) => {
      console.log('🗓️ DatePickerModal presenting with date:', newInitialDate);
      if (newInitialDate !== undefined) {
        setCurrentInitialDate(newInitialDate);
        const parsed = parseInitialDate(newInitialDate);
        setSelectedYear(parsed.year);
        setSelectedMonth(parsed.month);
        setSelectedDay(parsed.day);
      }
      present();
    },
    dismiss,
  }), [present, dismiss]);

  // Handle save
  const handleSave = () => {
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    console.log('🗓️ Date saved:', formattedDate);
    onSave(formattedDate);
    dismiss();
  };

  // Scroll to initial positions when modal opens
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Scroll to selected year
      const yearIndex = years.findIndex(year => year === selectedYear);
      if (yearIndex >= 0 && yearScrollRef.current) {
        yearScrollRef.current.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: true });
      }

      // Scroll to selected month  
      const monthIndex = months.findIndex(month => month.value === selectedMonth);
      if (monthIndex >= 0 && monthScrollRef.current) {
        monthScrollRef.current.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: true });
      }

      // Scroll to selected day
      const dayIndex = days.findIndex(day => day === selectedDay);
      if (dayIndex >= 0 && dayScrollRef.current) {
        dayScrollRef.current.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: true });
      }
    }, 500); // Give modal time to fully present and settle

    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth, selectedDay]);

  const PickerColumn = ({ 
    data, 
    selectedValue, 
    onSelect, 
    renderItem, 
    scrollRef 
  }: {
    data: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    renderItem: (item: any, isSelected: boolean) => React.ReactNode;
    scrollRef: React.RefObject<any>;
  }) => {
    // Commit selection only when scrolling stops for smoother performance
    const handleScrollEnd = (event: any) => {
      const { contentOffset } = event.nativeEvent;
      const index = Math.round(contentOffset.y / ITEM_HEIGHT);
      
      // Snap precisely to computed index
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
      
      if (index >= 0 && index < data.length) {
        const selectedItem = data[index];
        if (typeof selectedItem === 'object' && selectedItem.value !== undefined) {
          onSelect(selectedItem);
        } else {
          onSelect(selectedItem);
        }
      }
    };

    return (
      <View className="flex-1 relative">
        {/* Selection indicator overlay */}
        <View className="absolute top-[75px] left-0 right-0 h-[50px] border-t border-b border-primary-200 bg-primary-50/30 z-10 pointer-events-none" />
        
        <BottomSheetScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: CENTER_PAD }}
          style={{ height: PICKER_HEIGHT }}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          bounces={false}
        >
          {data.map((item, index) => {
            const value = typeof item === 'object' ? item.value : item;
            const isSelected = value === selectedValue;
            return (
              <View
                key={index}
                className="h-[50px] justify-center items-center"
              >
                {renderItem(item, isSelected)}
              </View>
            );
          })}
        </BottomSheetScrollView>
      </View>
    );
  };

  return (
    <Modal 
      ref={modalRef} 
      snapPoints={['60%']}
      title={title}
    >
      {/* Date Picker */}
      <View className="flex-1 px-5 py-4">
        <Text className="text-center text-gray-600 mb-4 text-sm">Scroll smoothly through the options to select your birthday</Text>
        <View className="flex-row h-[200px] bg-gray-50 rounded-lg overflow-hidden">
          {/* Month Column */}
          <PickerColumn
            data={months}
            selectedValue={selectedMonth}
            onSelect={(month) => setSelectedMonth(month.value)}
            renderItem={(month, isSelected) => (
              <Text className={`text-center font-semibold ${
                isSelected ? 'text-primaryText text-lg' : 'text-gray-600 text-base'
              }`}>
                {month.name}
              </Text>
            )}
            scrollRef={monthScrollRef}
          />
          
          {/* Separator */}
          <View className="w-[1px] bg-gray-300 mx-2" />

          {/* Day Column */}
          <PickerColumn
            data={days}
            selectedValue={selectedDay}
            onSelect={setSelectedDay}
            renderItem={(day, isSelected) => (
              <Text className={`text-center font-semibold ${
                isSelected ? 'text-primaryText text-lg' : 'text-gray-600 text-base'
              }`}>
                {day}
              </Text>
            )}
            scrollRef={dayScrollRef}
          />
          
          {/* Separator */}
          <View className="w-[1px] bg-gray-300 mx-2" />

          {/* Year Column */}
          <PickerColumn
            data={years}
            selectedValue={selectedYear}
            onSelect={setSelectedYear}
            renderItem={(year, isSelected) => (
              <Text className={`text-center font-semibold ${
                isSelected ? 'text-primaryText text-lg' : 'text-gray-600 text-base'
              }`}>
                {year}
              </Text>
            )}
            scrollRef={yearScrollRef}
          />
        </View>
      </View>

      {/* Save Button */}
      <View className="p-5">
        <Pressable
          onPress={handleSave}
          className="bg-primaryText rounded-[4px] py-4 items-center h-[55px] justify-center"
        >
          <Text className="text-white font-regular text-[16px]">Save</Text>
        </Pressable>
      </View>
    </Modal>
  );
});

DatePickerModal.displayName = 'DatePickerModal';

export default DatePickerModal;