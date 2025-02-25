import * as React from 'react';
import Svg, { Circle, ClipPath, Defs, G, Path } from 'react-native-svg';

function OrderIcon(props: any) {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={20} cy={20} r={20} fill="#EC9F01" />
      <G clipPath="url(#clip0_873_1720)" fill="#fff">
        <Path d="M14.75 17a.75.75 0 100-1.5H14V14a.75.75 0 10-1.5 0v2.25a.75.75 0 00.75.75h1.5z" />
        <Path d="M31.779 21.346l-1.384-1.384-1.069-2.85a.75.75 0 00-.7-.487h-1.5a.75.75 0 000 1.5h.978l.941 2.512c.038.1.097.191.173.267l1.282 1.282v3.064h-1.905a3 3 0 00-3.72-1.279V15.56a.81.81 0 00-.81-.81H18.28A5.25 5.25 0 1011 20.986v4.954a.81.81 0 00.81.81h.315a3 3 0 006 0H23a3 3 0 006 0h2.25A.75.75 0 0032 26v-4.125a.75.75 0 00-.221-.529zM9.5 16.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zm5.625 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm10.875 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </G>
      <Defs>
        <ClipPath id="clip0_873_1720">
          <Path fill="#fff" transform="translate(8 8)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default OrderIcon;
