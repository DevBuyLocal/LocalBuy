import { type RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { type BProps, Button, type View } from '../ui';
interface TCustomButton extends Partial<BProps & RefAttributes<View>> {
  label: string;
  containerClassname?: string | undefined;
}

function CustomButton(props: TCustomButton) {
  const { label, containerClassname, ...rest } = props;
  return (
    <Button
      label={label}
      className={twMerge(
        'h-[55px] items-center  justify-center rounded-[4px] border border-primaryText bg-primaryText disabled:opacity-60',
        containerClassname
      )}
      textClassName="text-white text-[16px] font-regular"
      indicatorClassName="text-white"
      {...rest}
    />
  );
}

CustomButton.Secondary = (props: TCustomButton) => {
  const { label, containerClassname, ...rest } = props;

  return (
    <Button
      label={label}
      className={twMerge(
        'h-[55px] items-center justify-center rounded-[4px] border border-primaryText bg-white disabled:opacity-60',
        containerClassname
      )}
      textClassName="text-primaryText text-[16px] items-center"
      indicatorClassName="text-primaryText"
      {...rest}
    />
  );
};

export default CustomButton;
