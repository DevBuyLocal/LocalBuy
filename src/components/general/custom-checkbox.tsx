import React from 'react';

import { Checkbox, type RootProps, Text, View } from '../ui';

interface Props extends Partial<RootProps> {
  label: string;
  description?: string;
  isChecked?: boolean;
}

const CustomCheckbox = (props: Props) => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Checkbox.Root
      checked={checked}
      onChange={setChecked}
      accessibilityLabel="accept terms of condition"
      {...props}
    >
      <Checkbox.Icon checked={props?.isChecked || checked} />
      <View className="ml-2 w-[95%]">
        <Checkbox.Label
          text={props.label}
          className="-mt-1 ml-0 pr-0 text-[16px] font-normal"
        />
        <Text className="mt-1 text-[12px] opacity-75">{props.description}</Text>
      </View>
    </Checkbox.Root>
  );
};

export default CustomCheckbox;
