import React, { type PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import Container from './container';

interface InputViewProps extends PropsWithChildren<ScrollViewProps> {}

function InputView(props: InputViewProps) {
  return (
    <Container.Box>
      <AvoidSoftInputView>
        <ScrollView
          className="h-full"
          contentContainerClassName="flex-1 h-full"
        >
          {props.children}
        </ScrollView>
      </AvoidSoftInputView>
    </Container.Box>
  );
}

export default InputView;
