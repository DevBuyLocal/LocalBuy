import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React, { type RefAttributes, useEffect, useRef, useState } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';
import { Animated, Pressable, StyleSheet, type TextInput } from 'react-native';
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
// eslint-disable-next-line max-params
function interpolate(
  animatedValue: Animated.Value,
  a: number,
  b: number,
  c: number | string,
  d: any
) {
  return animatedValue.interpolate({
    inputRange: [a, b],
    outputRange: [c, d], // Adjust these values to control label position
  });
}

// eslint-disable-next-line max-lines-per-function
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
  const [show, setShow] = useState(false);
  const animatedValue = useRef(new Animated.Value(field.value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || (field.value && field.value.length > 0) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isFocused, field.value]);

  const labelStyle = {
    left: 16,
    top: interpolate(animatedValue, 0, 1, 20, -8),
    opacity: interpolate(animatedValue, 0, 1, 0, 1),
    fontSize: interpolate(animatedValue, 0, 1, 16, 14),
    color: interpolate(
      animatedValue,
      0,
      1,
      '#12121233',
      error ? '#E84343' : '#EC9F01BF'
    ),
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  };
  const style = styles(error);
  return (
    <View className={twMerge('mt-3 w-full', containerClass)}>
      {!isSearch && (
        <Animated.Text className={'absolute'} style={labelStyle}>
          {placeholder}
        </Animated.Text>
      )}
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
        value={field.value}
        disabled={onPress !== undefined}
        onChangeText={field.onChange}
        secureTextEntry={isPassword && !show}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? '' : placeholder}
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
                <Feather name="eye" size={20} color="#121212CC" />
              ) : (
                <Feather name="eye-off" size={20} color="#121212CC" />
              )}
            </Pressable>
          ) : undefined
        }
        className={twMerge(
          isSearch
            ? 'bg-[#F7F7F7] w-full rounded-[32px] h-[50px] pl-[35px] placeholder:color-[#12121280] text-[16px]'
            : 'h-[48px] w-full rounded-[6px] border border-[#12121233] px-[10px] placeholder:color-[#12121280] text-[16px]'
        )}
        {...props}
      />
      {(fieldState?.error || error) && (
        <View className="flex-row items-center">
          <AntDesign name="exclamationcircle" size={10} color="#E84343" />
          <Text className="ml-1 text-[12px] color-[#E84343]">
            {fieldState?.error?.message || error}
          </Text>
        </View>
      )}
      {description && !error && (
        <View>
          <Text className="text-[12px] opacity-65">{description}</Text>
        </View>
      )}
    </View>
  );
}

export default ControlledCustomInput;

const styles = (error?: string) =>
  StyleSheet.create({
    input: {
      fontSize: 16,
      color: '#000000',
      backgroundColor: '#FFFFFF',
    },
    inputFocused: {
      borderColor: error ? '#E84343' : '#EC9F01BF',
      borderWidth: 2,
    },
  });
