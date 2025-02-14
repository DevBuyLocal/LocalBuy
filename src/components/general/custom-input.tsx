import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from 'nativewind';
import React, { type RefAttributes, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, type TextInput } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { Input, type NInputProps, Text, View } from '../ui';

interface CustomInputProps
  extends Partial<NInputProps & RefAttributes<TextInput>> {
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string;
  description?: string;
  placeholder?: string;
  containerClass?: string;
  isSearch?: boolean;
  isPassword?: boolean;
  onPress?: () => void;
}

// eslint-disable-next-line max-lines-per-function
function CustomInput({
  onChangeText,
  placeholder = 'Placeholder',
  value = '',
  error,
  description,
  isSearch,
  isPassword,
  onPress,
  containerClass,
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [show, setShow] = useState(false);
  const { colorScheme } = useColorScheme();

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0))?.current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || (value?.length && value?.length > 0) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isFocused, value]);
  function interpolate(a: number, b: number, c: number | string, d: any) {
    return animatedValue.interpolate({
      inputRange: [a, b],
      outputRange: [c, d], // Adjust these values to control label position
    });
  }
  const labelStyle = {
    left: 16,
    top: interpolate(0, 1, 20, -8),
    opacity: interpolate(0, 1, 0, 1),
    fontSize: interpolate(0, 1, 16, 14),
    color: interpolate(0, 1, '#12121233', error ? '#E84343' : '#EC9F01BF'),
    backgroundColor: colorScheme === 'dark' ? '#282828' : '#FFFFFF',
    zIndex: 1,
  };
  const style = styles(error, colorScheme);

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
        value={value}
        disabled={onPress !== undefined}
        onChangeText={onChangeText}
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
              color={colorScheme === 'dark' ? '#fff' : '#030C0AB2'}
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
            ? 'bg-[#F7F7F7] dark:bg-[#282828] w-full rounded-[32px] h-[50px] pl-[35px] placeholder:color-[#12121280] dark:placeholder:color-[#f5f5f5] text-[16px]'
            : 'h-[48px] w-full rounded-[6px] border border-[#12121233] px-[10px] dark:placeholder:color-[#f5f5f5] placeholder:color-[#12121280] text-[16px]'
        )}
        {...props}
      />
      {error && (
        <View className="flex-row items-center">
          <AntDesign name="exclamationcircle" size={10} color="#E84343" />
          <Text className="ml-1 text-[12px] color-[#E84343]">{error}</Text>
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

export default CustomInput;

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
