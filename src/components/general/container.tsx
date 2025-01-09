import { View } from 'moti';
import React, { type PropsWithChildren } from 'react';
import { type ViewProps } from 'react-native';

import Header, { type HeaderProps } from './header';

interface ContainerProps
  extends Partial<ViewProps & PropsWithChildren & HeaderProps> {
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
      {props.showHeader && <Header headerTitle={props.headerTitle} />}
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
