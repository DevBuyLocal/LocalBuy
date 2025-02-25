import React from 'react';
import { type ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { twMerge } from 'tailwind-merge';

import { Image, Text, View } from '../ui';

interface EmptyProps extends Partial<ViewProps> {
  image?: any;
  title?: string;
  desc?: string;
  buttonView?: React.JSX.Element;
  containerClassName?: string | undefined;
}

function Empty(props: EmptyProps) {
  return (
    <View
      className={twMerge('items-center', props.containerClassName)}
      {...props}
    >
      <Image
        source={props.image || require('../../../assets/images/empty-cart.png')}
        className="size-[120px]"
      />
      {props.title && (
        <Text className="text-center text-[18px] font-medium">
          {props.title}
        </Text>
      )}
      {props.desc && (
        <Text className="m-3 text-center text-[14px] opacity-65">
          {props.desc}
        </Text>
      )}
      {props.buttonView && props.buttonView}
    </View>
  );
}

export default Empty;
