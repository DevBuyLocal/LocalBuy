import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Inventory = ({ color = '#CCC', ...props }: SvgProps) => (
  <Svg width={22} height={20} viewBox="0 0 22 20" fill="none" {...props}>
    <Path
      d="M2.5.5h17v2h-17v-2zm-.82 3h18.64l1.18 5.901V11.5H20v8h-2v-8h-5v8H2v-8H.5V9.401L1.68 3.5zm2.32 8v6h7v-6H4z"
      fill={color || '#121212'}
      fillOpacity={1}
    />
  </Svg>
);
