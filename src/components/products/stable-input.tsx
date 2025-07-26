import React from 'react';
import { TextInput } from 'react-native';

interface StableInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const StableInput = React.memo(({ value, onChangeText, placeholder }: StableInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={3}
      autoCorrect={false}
      autoCapitalize="none"
      spellCheck={false}
      style={{
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: '#FFFFFF',
        color: '#000000',
      }}
      placeholderTextColor="#999999"
    />
  );
});

StableInput.displayName = 'StableInput';

export default StableInput; 