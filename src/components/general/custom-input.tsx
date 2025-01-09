import Feather from '@expo/vector-icons/Feather';
import React, { type RefAttributes, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, type TextInput } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { Input, type NInputProps, View } from '../ui';
import { Search } from '../ui/icons';

interface CustomInputProps
  extends Partial<NInputProps & RefAttributes<TextInput>> {
  onChangeText?: (text: string) => void;
  value?: string;
  placeholder?: string;
  isSearch?: boolean;
  isPassword?: boolean;
  onPress?: () => void;
}

function CustomInput({
  onChangeText,
  placeholder = 'Title',
  value = '',
  isSearch,
  isPassword,
  onPress,
  ...props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [show, setShow] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0))?.current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value.length > 0 ? 1 : 0,
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
    color: interpolate(0, 1, '#12121233', '#EC9F01BF'),
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  };

  return (
    <View className="mt-3 w-full  ">
      {!isSearch && (
        <Animated.Text className={'absolute'} style={labelStyle}>
          {placeholder}
        </Animated.Text>
      )}
      {onPress && (
        <Pressable
          onPress={onPress}
          className="absolute z-10 h-[48px] w-full"
        />
      )}
      <Input
        style={
          !isSearch
            ? [styles.input, isFocused && styles.inputFocused]
            : undefined
        }
        value={value}
        disabled={onPress !== undefined}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !!show}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? '' : placeholder}
        leftIcon={isSearch ? <Search /> : undefined}
        rightIcon={
          isPassword ? (
            <Pressable
              onPress={() => setShow((prev) => !prev)}
              className="px-2 py-1"
            >
              {show ? (
                <Feather name="eye-off" size={24} color="#121212CC" />
              ) : (
                <Feather name="eye" size={24} color="#121212CC" />
              )}
            </Pressable>
          ) : undefined
        }
        className={twMerge(
          isSearch
            ? 'bg-[#F7F7F7] w-full rounded-[32px] h-[43px] pl-[35px] placeholder:color-[#12121280] text-[16px]'
            : 'h-[48px] w-full rounded-[6px] border border-[#12121233] px-[10px] placeholder:color-[#12121233]'
        )}
        {...props}
      />
    </View>
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#EC9F01BF',
    borderWidth: 2,
  },
});
