import React, { useRef } from 'react';
import { Pressable } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, View } from '@/components/ui';
import DatePickerModal from './date-picker-modal';

interface DatePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function DatePickerInput<T extends FieldValues>({
  name,
  control,
  placeholder = "Date of birth (optional)",
  description,
  error,
  required = false,
}: DatePickerInputProps<T>) {
  const datePickerRef = useRef<any>(null);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString || !dateString.trim()) return '';
    
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthIndex = parseInt(month) - 1;
        const monthName = monthNames[monthIndex] || month;
        
        return `${monthName} ${parseInt(day)}, ${year}`;
      }
    } catch (e) {
      console.log('Error formatting date:', e);
    }
    
    return dateString;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          <View className="mb-4">
            <Pressable
              onPress={() => {
                console.log('🗓️ Date picker input pressed!');
                datePickerRef.current?.present(value);
              }}
              className={`w-full p-4 border rounded-lg bg-white ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Text className={`${
                value && value.trim() 
                  ? 'text-gray-900' 
                  : 'text-gray-500'
              }`}>
                {value && value.trim() ? formatDisplayDate(value) : placeholder}
              </Text>
            </Pressable>
            
            {description && (
              <Text className="mt-1 text-sm text-gray-600">{description}</Text>
            )}
            
            {error && (
              <Text className="mt-1 text-sm text-red-500">{error}</Text>
            )}
          </View>

          <DatePickerModal
            ref={datePickerRef}
            onSave={(date) => {
              console.log('🗓️ Date selected:', date);
              onChange(date);
            }}
            title="Enter birthday"
          />
        </>
      )}
    />
  );
}

export default DatePickerInput;