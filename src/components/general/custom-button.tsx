import { type RefAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { type BProps, Button, type View } from '../ui';
interface TCustomButton extends Partial<BProps & RefAttributes<View>> {
  label: string;
  containerClassname?: string | undefined;
}

function CustomButton(props: TCustomButton) {
  const { label, containerClassname, textClassName, ...rest } = props;
  return (
    <Button
      label={label}
      className={twMerge(
        'h-[55px] items-center  justify-center rounded-[4px] border border-primaryText dark:bg-primaryText bg-primaryText disabled:opacity-60',
        containerClassname
      )}
      textClassName={textClassName || "text-white dark:text-[#fff] text-[16px] font-regular"}
      indicatorClassName="text-white dark:text-[#fff]"
      {...rest}
    />
  );
}

CustomButton.Secondary = (props: TCustomButton) => {
  const { label, containerClassname, textClassName, ...rest } = props;

  return (
    <Button
      label={label}
      className={twMerge(
        'h-[55px] items-center justify-center rounded-[4px] border border-black bg-white disabled:opacity-60',
        containerClassname
      )}
      textClassName={textClassName || "text-black text-[16px] items-center"}
      indicatorClassName="text-primaryText"
      {...rest}
    />
  );
};

export default CustomButton;
