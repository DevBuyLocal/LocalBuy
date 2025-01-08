import { View } from 'moti';
import React, { type PropsWithChildren } from 'react';
import { type ViewProps } from 'react-native';

interface ContainerProps extends Partial<ViewProps & PropsWithChildren> {
  showHeader?: boolean;
  isPage?: boolean;
}

function Container(props: ContainerProps) {
  return (
    <View className="px-5" {...props}>
      {props.children}
    </View>
  );
}

Container.Page = (props: ContainerProps) => {
  return (
    <View className="flex-1 px-5" {...props}>
      {props.children}
    </View>
  );
};

Container.Box = (props: ContainerProps) => {
  return (
    <View className="px-5" {...props}>
      {props.children}
    </View>
  );
};

export default Container;
