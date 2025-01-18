import { View } from 'moti';
import React, { type PropsWithChildren } from 'react';
import { type ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import Header, { type HeaderProps } from './header';

interface ContainerProps
  extends Partial<ViewProps & PropsWithChildren & HeaderProps> {
  showHeader?: boolean;
  isPage?: boolean;
  containerClassName?: string | undefined;
}

function Container(props: ContainerProps) {
  return (
    <View
      className={twMerge('px-5 bg-[#FFFFFF]', props.containerClassName)}
      {...props}
    >
      {props.children}
    </View>
  );
}

Container.Page = (props: ContainerProps) => {
  return (
    <View
      className={twMerge('flex-1 bg-[#FFFFFF]', props.containerClassName)}
      {...props}
    >
      {props.showHeader && (
        <Header
          headerTitle={props.headerTitle}
          headerComponent={props.headerComponent}
          backPress={props.backPress}
          showCart={props.showCart}
          hideBackButton={props.hideBackButton}
          rightHeaderIcon={props.rightHeaderIcon}
        />
      )}
      {props.children}
    </View>
  );
};

Container.Box = (props: ContainerProps) => {
  return (
    <View className={twMerge('px-5 mt-2', props.containerClassName)} {...props}>
      {props.children}
    </View>
  );
};

export default Container;
