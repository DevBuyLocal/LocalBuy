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
  itemId: number;
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
  const foundItem = cartItems.find((item) => item?.id === props?.itemId);
  const [inQuantity, setInQuantity] = React.useState<number>(
    foundItem?.quantity || 1
  );
  React.useEffect(() => {
    if (foundItem && !token) {
      setInQuantity(foundItem?.quantity);
    }
  }, [foundItem, token]);
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
        // setLoading(true);
        mutate({ cartItemId: itemId, quantity });
      }, 700),
    [mutate]
  );

  const handleDecrease = React.useCallback(() => {
    // if (inQuantity <= 1) return;
    if (Number(props?.moq) <= inQuantity) return;

    if (token && props.cartItemId) {
      setInQuantity((prev) => prev - 1);
      updateQuantityDebounce(props.cartItemId, inQuantity - 1);
      return;
    }
    if (props.useWithoutApi && props.quantity) {
      props.setQuantity?.(Math.max(1, props.quantity - 1));
      return;
    }
    decreaseQuantity(props.itemId, props.removeOnZero);
  }, [inQuantity, token, props, decreaseQuantity, updateQuantityDebounce]);

  const handleIncrease = React.useCallback(() => {
    if (Number(props?.moq) <= inQuantity) return;
    if (token && props.cartItemId) {
      setInQuantity((prev) => prev + 1);
      updateQuantityDebounce(props.cartItemId, inQuantity + 1);
      return;
    }
    if (props.useWithoutApi && props.selectedOption && props.quantity) {
      if (props?.selectedOption?.moq <= props.quantity) return;
      props.setQuantity?.((prev) => prev + 1);
      return;
    }
    increaseQuantity(props.itemId);
  }, [props, inQuantity, token, increaseQuantity, updateQuantityDebounce]);

  return (
    <View
      className={twMerge(
        'flex-row items-center justify-between overflow-hidden rounded-[4px] px-4 py-1 border dark:border-[#fff]',
        props.containerClass
      )}
      {...props}
    >
      <Pressable onPress={handleDecrease} hitSlop={10} className="pr-10">
        <Text className="text-[20px] font-bold">-</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator className="size-sm" />
      ) : (
        <Text className="text-[20px] font-medium text-black">
          {props.useWithoutApi ? props.quantity : inQuantity}
        </Text>
      )}

      <Pressable onPress={handleIncrease} hitSlop={10} className="pl-10">
        <Text className="text-[20px] font-bold">+</Text>
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
