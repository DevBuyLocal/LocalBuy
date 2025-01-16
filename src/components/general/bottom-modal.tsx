import { type BottomSheetModalProps } from '@gorhom/bottom-sheet';
import { type BottomSheetModalMethods } from '@gorhom/bottom-sheet/src/types';
import React, { type PropsWithChildren } from 'react';

import { Modal, View } from '../ui';

interface BottomModalProps
  extends PropsWithChildren<
    BottomSheetModalProps & {
      title?: string;
    } & React.RefAttributes<BottomSheetModalMethods>
  > {
  ref: React.RefObject<BottomSheetModalMethods>;
}

function BottomModal({ ref, children, ...props }: BottomModalProps) {
  return (
    <Modal
      snapPoints={['40%']} // optional
      title="Modal Title"
      ref={ref}
      {...props}
    >
      <View>{children}</View>
    </Modal>
  );
}

export default BottomModal;
