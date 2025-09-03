import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import React, { type RefAttributes, useState } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';
import { Pressable, StyleSheet, type TextInput } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { Input, type NInputProps, Text, View } from '../ui';

interface ControlledCustomInputProps<T extends FieldValues>
  extends Partial<NInputProps & RefAttributes<TextInput>> {
  error?: string;
  description?: string;
  placeholder?: string;
  name: Path<T>;
  containerClass?: string;
  isSearch?: boolean;
  isPassword?: boolean;
  control: Control<T>;
  onPress?: () => void;
}

function ControlledCustomInput<T extends FieldValues>({
  placeholder = 'Placeholder',
  error,
  description,
  isSearch,
  name,
  control,
  isPassword,
  onPress,
  containerClass,
  ...props
}: ControlledCustomInputProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
  });
  const [isFocused, setIsFocused] = useState(false);

  const { colorScheme } = useColorScheme();

  const [show, setShow] = useState(false);
  const hasError = fieldState?.error?.message || error;
  const style = styles(hasError, colorScheme);
  return (
    <View className={twMerge('mt-3 w-full', containerClass)}>
      {onPress && (
        <Pressable
          onPress={onPress}
          className={twMerge('absolute z-10 h-[48px] w-full')}
        />
      )}
      <Input
        style={
          !isSearch ? [style.input, isFocused && style.inputFocused] : undefined
        }
        ref={field.ref as any}
        value={field.value}
        disabled={onPress !== undefined}
        onChangeText={field.onChange}
        secureTextEntry={isPassword && !show}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          field.onBlur();
        }}
        placeholder={placeholder}
        leftIcon={
          isSearch ? (
            <Feather
              name="search"
              size={22}
              style={{ marginTop: 3 }}
              color="#030C0AB2"
            />
          ) : undefined
        }
        rightIcon={
          isPassword ? (
            <Pressable
              onPress={() => setShow((prev) => !prev)}
              className="px-2 py-1"
            >
              {show ? (
                <Feather
                  name="eye"
                  size={20}
                  color={colorScheme === 'dark' ? 'white' : '#121212CC'}
                />
              ) : (
                <Feather
                  name="eye-off"
                  size={20}
                  color={colorScheme === 'dark' ? 'white' : '#121212CC'}
                />
              )}
            </Pressable>
          ) : undefined
        }
        className={twMerge(
          isSearch
            ? 'bg-[#F7F7F7] w-full rounded-[32px] h-[50px] pl-[35px] text-[16px]'
            : 'h-[48px] w-full rounded-[6px] border border-[#12121233] px-[10px] text-[16px] leading-2'
        )}
        {...props}
      />
      {hasError && (
        <View className="flex-row items-center">
          <AntDesign name="exclamationcircle" size={10} color="#E84343" />
          <Text className="ml-1 text-[12px] color-[#E84343]">
            {hasError}
          </Text>
        </View>
      )}
      {description && !hasError && (
        <View>
          <Text className="text-[12px] opacity-65">{description}</Text>
        </View>
      )}
    </View>
  );
}

export default ControlledCustomInput;

const styles = (error?: string, scheme?: string) => {
  return StyleSheet.create({
    input: {
      fontSize: 16,
      color: scheme === 'dark' ? '#FFF' : '#282828',
      backgroundColor: scheme === 'dark' ? '#282828' : '#FFFFFF',
    },
    inputFocused: {
      borderColor: error ? '#E84343' : '#EC9F01BF',
      borderWidth: 2,
    },
  });
};
