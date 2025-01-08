import { type RefAttributes } from 'react';

import { type BProps, Button, type View } from '../ui';
interface TCustomButton extends Partial<BProps & RefAttributes<View>> {
  label: string;
}

function CustomButton(props: TCustomButton) {
  const { label, ...rest } = props;
  return (
    <Button
      label={label}
      {...rest}
      className="bg-primaryText border-primaryText  h-[55px] items-center justify-center rounded-[4px] border disabled:opacity-60"
      textClassName="text-white text-[16px]"
      indicatorClassName="text-white"
    />
  );
}

CustomButton.Secondary = (props: TCustomButton) => {
  const { label, ...rest } = props;
  return (
    <Button
      label={label}
      {...rest}
      className="border-primaryText h-[55px] items-center justify-center rounded-[4px] border bg-white disabled:opacity-60"
      textClassName="text-primaryText text-[16px] items-center"
      indicatorClassName="text-primaryText"
    />
  );
};

export default CustomButton;
