import debounce from 'lodash.debounce';
import React, { type Dispatch, type SetStateAction } from 'react';
import { ActivityIndicator, type ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { type Option } from '@/api';
import { useGetCartItems, useUpdateCartItem } from '@/api/cart';
import { type TCartItem, type TProductOption } from '@/api/cart/types';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

import { Pressable, Text, View } from '../ui';

interface QuantitySelectProps extends Partial<ViewProps> {
  itemId: string | number;
  cartItemId?: TCartItem['cartId'];
  containerClass?: string | undefined;
  removeOnZero?: boolean;
  useWithoutApi?: boolean;
  quantity?: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
  selectedOption?: Option;
  moq?: TProductOption['moq'];
  updateQuantity?: (quantity: number) => void;
}

function QuantitySelect(props: QuantitySelectProps) {
  const { token } = useAuth();
  const { data, refetch } = useGetCartItems();
  const { increaseQuantity, decreaseQuantity, products_in_cart } =
    useCart(CartSelector);

  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });
  const cartItems = token ? data?.items || [] : products_in_cart || [];
  // console.log('🚀 ~ QuantitySelect ~ cartItems:', cartItems);

  const foundItem = cartItems.find((item) => item?.id === props?.itemId);

  const [inQuantity, setInQuantity] = React.useState<number>(
    foundItem?.quantity || 1
  );
  // console.log('🚀 ~ QuantitySelect ~ inQuantity:', inQuantity);
  // React.useEffect(() => {
  //   if (foundItem) {
  //     setInQuantity(foundItem?.quantity);
  //   }
  // }, [foundItem]);

  const { mutate } = useUpdateCartItem({
    onSuccess: () => {
      setSuccess('Item updated');
      refetch();
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  let updateQuantityDebounce = React.useMemo(
    () =>
      debounce((itemId: number, quantity: number) => {
        setLoading(true);
        mutate({ cartItemId: itemId, quantity });
      }, 700),
    [setLoading, mutate]
  );

  return (
    <View
      className={twMerge(
        'flex-row items-center justify-between overflow-hidden rounded-[4px] px-4 py-1 border dark:border-[#fff]',
        props.containerClass
      )}
      {...props}
    >
      <Pressable
        onPress={() => {
          if (token && props.cartItemId) {
            if (inQuantity <= 1) return;
            setInQuantity(inQuantity - 1);
            updateQuantityDebounce(props.cartItemId, inQuantity - 1);
            return;
          }
          if (props.useWithoutApi && props.quantity) {
            props.setQuantity &&
              props.setQuantity(Math.max(1, props.quantity - 1));
            return;
          }
          decreaseQuantity(props.cartItemId, props.removeOnZero);
        }}
        // className="px-[25px]"
      >
        <Text className="text-[20px] font-bold">-</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator className="size-sm" />
      ) : (
        <Text className="text-[20px] font-medium text-black">
          {props.useWithoutApi ? props.quantity : inQuantity}
        </Text>
      )}

      <Pressable
        onPress={() => {
          if (token && props.cartItemId) {
            if (Number(props?.moq) <= inQuantity) return;
            setInQuantity(inQuantity + 1);
            updateQuantityDebounce(props.cartItemId, inQuantity + 1);
            return;
          }
          if (props.useWithoutApi && props.selectedOption && props.quantity) {
            if (props?.selectedOption?.moq <= props.quantity) return;
            props.setQuantity && props.setQuantity((prev) => prev + 1);
            return;
          }
          increaseQuantity(props.itemId);
        }}
        // className="px-[25px] py-px"
      >
        <Text className="text-[20px] font-bold">+</Text>
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
