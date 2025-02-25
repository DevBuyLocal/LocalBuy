import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function NewsIcon(props: any) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={20} cy={20} r={20} fill="#1FAD64" />
      <Path
        d="M8 21.5l12-12 9.75.75.75 9.75-12 12L8 21.5zm15-6.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z"
        fill="#fff"
      />
    </Svg>
  );
}

export default NewsIcon;
