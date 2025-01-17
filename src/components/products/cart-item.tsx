import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { CartSelector, useCart } from '@/lib/cart';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import CustomInput from '../general/custom-input';
import { Image, Modal, Text, useModal, View } from '../ui';
import QuantitySelect from './quantity-select';

interface CartItemProps extends Partial<PressableProps> {
  item: any;
  containerClassname?: string | undefined;
  note?: string;
}

// eslint-disable-next-line max-lines-per-function
function CartItem(props: CartItemProps) {
  const { removeFromCart, addNote } = useCart(CartSelector);
  const [imgSrc, setImgSrc] = React.useState(props?.item?.images[0]);
  const { ref, present, dismiss } = useModal();
  const [note, setNote] = useState('');

  function ADD_NOTE() {
    addNote(props?.item?.id, note);
    dismiss();
  }

  return (
    <View
      className={twMerge('rounded-[2px]  py-[5px]', props.containerClassname)}
    >
      <View className="flex-row justify-between gap-5">
        <Image
          source={
            imgSrc
              ? { uri: imgSrc }
              : require('../../../assets/images/img-p-holder.png')
          }
          className="h-[109px] w-[103px] overflow-hidden rounded-[8px]"
          style={{
            tintColor: imgSrc ? undefined : '#D5D5D580',
            resizeMode: 'contain',
            backgroundColor: '#F7F7F7',
          }}
          onError={() => {
            setImgSrc(null);
          }}
        />
        <View className="mb-1 justify-between" style={{ width: '65%' }}>
          <View>
            <Text className="text-[14px] font-bold">
              N{Number(props?.item?.price).toLocaleString()}
            </Text>
            <View className="">
              <Text
                numberOfLines={2}
                className="mt-2 text-[14px] font-thin opacity-65"
              >
                {props?.item?.name}
              </Text>
            </View>
            <QuantitySelect
              itemId={props.item.id}
              containerClass="w-[160px] rounded-full mt-4"
              removeOnZero={false}
            />
          </View>
          <View className="mt-5 flex-row gap-10 self-end">
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              onPress={() => {}}
            >
              Save for later
            </Text>
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              onPress={() => removeFromCart(props?.item?.id)}
            >
              Remove
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        className="mt-2 w-full flex-row items-center justify-between rounded-full bg-[#F7F7F7] p-3 px-5"
        onPress={present}
      >
        <View style={{ maxWidth: '80%' }}>
          <Text>Add a note</Text>
          {props?.item?.note && (
            <Text className="text-[12px] opacity-65" numberOfLines={1}>
              {props?.item?.note}
            </Text>
          )}
        </View>
        {props?.item?.note ? (
          <Text className="underline color-primaryText">Edit</Text>
        ) : (
          <Entypo name="chevron-small-right" size={20} color="black" />
        )}
      </Pressable>
      <Modal ref={ref} title="Note to shopper" snapPoints={['50%', '75%']}>
        <BottomSheetScrollView>
          <Container.Box>
            <CustomInput
              placeholder="Enter note"
              multiline
              numberOfLines={6}
              value={note}
              onChangeText={setNote}
              style={{
                minHeight: 100,
              }}
            />
            <CustomButton.Secondary
              containerClassname="mt-20"
              label={'Save'}
              onPress={ADD_NOTE}
            />
          </Container.Box>
        </BottomSheetScrollView>
      </Modal>
    </View>
  );
}

export default CartItem;
