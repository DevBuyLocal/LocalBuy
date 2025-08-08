import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useAddNote, useUpdateNote } from '@/api/cart';
import { type TCartItem } from '@/api/cart/types';
import { useRemoveCartItem } from '@/api/cart/use-remove-cart-item';
import { type SavedProductResponse } from '@/api/product/use-get-saved-products';
import { useRemoveFromSaved } from '@/api/product/use-remove-from-saved';
import { useSaveProduct } from '@/api/product/use-save-product';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';
import { calculateBulkPricing, formatBulkSavings } from '@/lib/utils';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import CustomInput from '../general/custom-input';
import { Image, Modal, Text, useModal, View } from '../ui';
import QuantitySelect from './quantity-select';

interface CartItemProps extends Partial<PressableProps> {
  item: TCartItem;
  savedProducts?: SavedProductResponse;
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
  
  // Individual loading state for this cart item
  const [itemLoading, setItemLoading] = React.useState(false);
  
  // Update image source when cart item changes
  React.useEffect(() => {
    setImgSrc(cart_item?.productOption?.image || []);
  }, [cart_item?.productOption?.image]);
  
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });
  const { ref, present, dismiss } = useModal();
  const [note, setNote] = useState(cart_item?.note || '');

  const [quantity, setQuantity] = useState<number>(props?.item?.quantity);

  // Sync quantity state with cart item
  React.useEffect(() => {
    setQuantity(props?.item?.quantity);
  }, [props?.item?.quantity]);

  const itemIsSaved = props?.savedProducts?.savedProducts?.find(
    (item) => item?.productId === props?.item?.productOption?.productId
  );

  const { mutate } = useAddNote({
    onSuccess() {
      dismiss();
      setSuccess('Note added successfully');
    },
    onError(error) {
      setError(error?.response?.data);
    },
    onSettled() {
      setItemLoading(false);
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
      setItemLoading(false);
    },
  });

  const { mutate: removeItem } = useRemoveCartItem({
    onSuccess: () => {
      setItemLoading(false);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setItemLoading(false);
    },
  });

  function ADD_NOTE() {
    if (token) {
      setItemLoading(true);
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

  const { mutate: saveProduct } = useSaveProduct({
    onSuccess: () => {
      setSuccess('Product saved for later');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { mutate: removeFromSaved } = useRemoveFromSaved({
    onSuccess: () => {
      setSuccess('Product removed from saved');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

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
            {/* Bulk Pricing Display */}
            {(() => {
              const bulkInfo = calculateBulkPricing(
                quantity,
                cart_item?.productOption?.price || 0,
                cart_item?.productOption?.bulkPrice,
                cart_item?.productOption?.bulkMoq || cart_item?.productOption?.moq
              );
              
              return (
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[14px] font-bold">
                      N{bulkInfo.currentPrice?.toLocaleString()}
                    </Text>
                    {bulkInfo.isBulkActive && (
                      <Text className="text-[12px] text-gray-500 line-through">
                        N{bulkInfo.originalPrice?.toLocaleString()}
                      </Text>
                    )}
                  </View>
                  
                  {/* Bulk Pricing Message - Under payment method in green container */}
                  {bulkInfo.isBulkActive && (
                    <View className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <Text className="text-[12px] text-green-700 font-medium">
                        Bulk discount applied: You saved ₦{(bulkInfo.savings * quantity).toLocaleString()} total ({bulkInfo.savingsPercentage?.toFixed(0)}% off)
                      </Text>
                    </View>
                  )}
                  
                  {/* Bulk Pricing Available Notification */}
                  {(cart_item?.productOption?.bulkPrice && !bulkInfo.isBulkActive) && (
                    <Text className="text-[12px] text-orange-600 mt-1">
                      This product has bulk pricing: buy {(cart_item?.productOption?.bulkMoq || cart_item?.productOption?.moq || 10)} or more to unlock
                    </Text>
                  )}
                </View>
              );
            })()}
            
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
              loading={itemLoading}
              setLoading={setItemLoading}
            />
          </View>
          <View className="mt-5 flex-row gap-10 self-end">
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              adjustsFontSizeToFit
              onPress={() => {
                if (token) {
                  if (itemIsSaved) {
                    removeFromSaved({
                      productId: itemIsSaved?.product?.id,
                    });
                    return;
                  }
                  saveProduct({
                    productId: props?.item?.productOption?.productId,
                  });
                  return;
                }
                redirectToLoginAndBack('/cart');
              }}
            >
              {itemIsSaved ? 'Remove from saved' : 'Save for later'}
            </Text>
            <Text
              className="text-[16px] font-medium underline color-[#0F3D30]"
              onPress={() => {
                if (token) {
                  setItemLoading(true);
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
              loading={itemLoading}
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
