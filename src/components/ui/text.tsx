import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet, Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
}

export const Text = ({
  className = '',
  style,
  tx,
  children,
  ...props
}: Props) => {
  const fontClass =
    className.split(' ').find((cls) => fontFamilyMapping[cls]) ??
    'dm-sans-regular-regular';

  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-base text-black  dark:text-white dm-sans-regular',
        className,
        fontClass ? `font-[${fontFamilyMapping[fontClass]}]` : 'dm-sans-regular'
      ),
    [className, fontClass]
  );

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontFamily: fontFamilyMapping[fontClass] || 'dm-sans-regular',
        },
        style,
      ]) as TextStyle,
    [style, fontClass]
  );
  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {tx ? translate(tx) : children}
    </NNText>
  );
};

const fontFamilyMapping: Record<string, string> = {
  'font-regular': 'dm-sans-regular',
  'font-medium': 'dm-sans-medium',
  'font-bold': 'dm-sans-bold',
};
