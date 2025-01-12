import React from 'react';

import { HEIGHT, Text, View, WIDTH } from '../ui';

type Props = {};

function ScreenTwo(props: Props) {
  return (
    <View
      className=" top-10 bg-blue-500"
      style={{ height: HEIGHT / 2, width: WIDTH * 0.911 }}
    >
      <Text>babss</Text>
    </View>
  );
}

export default ScreenTwo;
