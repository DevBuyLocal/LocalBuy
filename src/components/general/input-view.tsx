import React, { type PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

interface InputViewProps extends PropsWithChildren<ScrollViewProps> {}

function InputView(props: InputViewProps) {
  return (
    <AvoidSoftInputView style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 20
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {props.children}
      </ScrollView>
    </AvoidSoftInputView>
  );
}

export default InputView;
