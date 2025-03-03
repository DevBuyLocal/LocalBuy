import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useAddNote, useUpdateNote } from '@/api/cart';
import { type TCartItem } from '@/api/cart/types';
import { useRemoveCartItem } from '@/api/cart/use-remove-cart-item';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import CustomInput from '../general/custom-input';
import { Image, Modal, Text, useModal, View } from '../ui';
import QuantitySelect from './quantity-select';

interface CartItemProps extends Partial<PressableProps> {
  item: TCartItem;
  containerClassname?: string | undefined;
  note?: string;
}

// eslint-disable-next-line max-lines-per-function
function CartItem(props: CartItemProps) {
  const cart_item = props?.item;

  const { push } = useRouter();
  const { removeFromCart, addNote } = useCart(CartSelector);
  const { token } = useAuth();
  const [imgSrc, setImgSrc] = React.useState<string[] | null>(
    cart_item?.productOption?.image || []
  );
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });
  const { ref, present, dismiss } = useModal();
  const [note, setNote] = useState(cart_item?.note || '');

  const [quantity, setQuantity] = useState<number>(props?.item?.quantity);

  const { mutate } = useAddNote({
    onSuccess() {
      dismiss();
      setSuccess('Note added successfully');
    },
    onError(error) {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });
  const { mutate: UpdateMutate } = useUpdateNote({
    onSuccess() {
      dismiss();
      setSuccess('Note updated successfully');
    },
    onError(error) {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });

  const { mutate: removeItem } = useRemoveCartItem({
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  function ADD_NOTE() {
    if (token) {
      setLoading(true);
      if (cart_item?.note) {
        UpdateMutate({ cartItemId: cart_item?.id, note });
      } else {
        mutate({ cartItemId: cart_item?.id, note });
      }
      return;
    } else {
      addNote(cart_item?.id, note);
      dismiss();
    }
  }

  function redirectToLoginAndBack(path: Href, action?: () => void) {
    if (!token?.access) {
      push('/login?from=cart');
    } else {
      if (action) {
        action();
        return;
      }
      push(path);
    }
  }

  return (
    <View
      className={twMerge('rounded-[2px]  py-[5px]', props.containerClassname)}
    >
      <View className="flex-row justify-between gap-5">
        <Image
          source={
            imgSrc?.length
              ? { uri: imgSrc[0] }
              : require('../../../assets/images/img-p-holder.png')
          }
          className="h-[109px] w-[103px] overflow-hidden rounded-[8px]"
          style={{
            tintColor: imgSrc ? undefined : '#D5D5D580',
            backgroundColor: '#F7F7F7',
          }}
          onError={() => {
            setImgSrc(null);
          }}
          contentFit="contain"
        />
        <View className="mb-1 justify-between" style={{ width: '65%' }}>
          <View>
            <Text className="text-[14px] font-bold">
              N{Number(cart_item?.productOption?.price).toLocaleString()}
            </Text>
            <View className="">
              <Text
                numberOfLines={2}
                className="mt-2 text-[14px] font-thin opacity-65"
              >
                {cart_item?.productOption?.product?.name}
              </Text>
            </View>
            <QuantitySelect
              quantity={quantity}
              setQuantity={setQuantity}
              moq={props?.item?.productOption?.moq}
              itemId={props?.item?.id}
              cartItemId={props?.item?.id}
              containerClass="w-[160px] rounded-full mt-4"
              removeOnZero={false}
            />
          </View>
          <View className="mt-5 flex-row gap-10 self-end">
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              onPress={() => {
                if (token) {
                  return;
                }
                redirectToLoginAndBack('/cart');
              }}
            >
              Save for later
            </Text>
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              onPress={() => {
                if (token) {
                  setLoading(true);
                  removeItem({ cartItemId: props?.item?.id });
                  return;
                }
                removeFromCart(props?.item?.id);
              }}
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
              loading={loading}
              disabled={!note}
              onPress={ADD_NOTE}
            />
          </Container.Box>
        </BottomSheetScrollView>
      </Modal>
    </View>
  );
}

export default CartItem;
