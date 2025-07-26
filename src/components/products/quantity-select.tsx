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
  
  const cartItems = token ? data?.data?.items || [] : products_in_cart || [];
  const foundItem = cartItems.find((item) => item?.id === props?.itemId);
  
  // Get current quantity from props or found item
  const currentQuantity = props.useWithoutApi 
    ? (props.quantity || 1)
    : (foundItem?.quantity || 1);
  
  const [localQuantity, setLocalQuantity] = React.useState<number>(currentQuantity);
  
  // Update local quantity when props or found item changes
  React.useEffect(() => {
    const newQuantity = props.useWithoutApi 
      ? (props.quantity || 1)
      : (foundItem?.quantity || 1);
    setLocalQuantity(newQuantity);
  }, [props.quantity, foundItem?.quantity, props.useWithoutApi]);
  
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

  const updateQuantityDebounce = React.useMemo(
    () =>
      debounce((itemId: number, quantity: number) => {
        setLoading(true);
        mutate({ cartItemId: itemId, quantity });
      }, 500),
    [mutate, setLoading]
  );

  const handleDecrease = React.useCallback(() => {
    const newQuantity = localQuantity - 1;
    
    // Prevent going below 1
    if (newQuantity < 1) return;
    
    // Update local state immediately for responsive UI
    setLocalQuantity(newQuantity);
    
    if (token && props.cartItemId) {
      // For logged-in users, update via API
      updateQuantityDebounce(props.cartItemId, newQuantity);
    } else if (props.useWithoutApi && props.setQuantity) {
      // For non-API usage (like product details modal)
      props.setQuantity(newQuantity);
    } else {
      // For offline cart
      decreaseQuantity(props.itemId, props.removeOnZero);
    }
  }, [localQuantity, token, props, decreaseQuantity, updateQuantityDebounce]);

  const handleIncrease = React.useCallback(() => {
    const newQuantity = localQuantity + 1;
    
    // Update local state immediately for responsive UI
    setLocalQuantity(newQuantity);
    
    if (token && props.cartItemId) {
      // For logged-in users, update via API
      updateQuantityDebounce(props.cartItemId, newQuantity);
    } else if (props.useWithoutApi && props.setQuantity) {
      // For non-API usage (like product details modal)
      props.setQuantity(newQuantity);
    } else {
      // For offline cart
      increaseQuantity(props.itemId);
    }
  }, [localQuantity, token, props, increaseQuantity, updateQuantityDebounce]);

  // Determine if buttons should be disabled
  const isDecreaseDisabled = localQuantity <= 1;
  const isIncreaseDisabled = false; // Never disable increase button

  return (
    <View
      className={twMerge(
        'flex-row items-center justify-between overflow-hidden rounded-[4px] px-4 py-1 border dark:border-[#fff]',
        props.containerClass
      )}
      {...props}
    >
      <Pressable 
        onPress={handleDecrease} 
        hitSlop={10} 
        className={`pr-10 ${isDecreaseDisabled ? 'opacity-50' : ''}`}
        disabled={isDecreaseDisabled}
      >
        <Text className={`text-[20px] font-bold ${isDecreaseDisabled ? 'text-gray-400' : ''}`}>
          -
        </Text>
      </Pressable>
      
      {loading ? (
        <ActivityIndicator className="size-sm" />
      ) : (
        <Text className="text-[20px] font-medium text-black">
          {localQuantity}
        </Text>
      )}

      <Pressable 
        onPress={handleIncrease} 
        hitSlop={10} 
        className={`pl-10 ${isIncreaseDisabled ? 'opacity-50' : ''}`}
        disabled={isIncreaseDisabled}
      >
        <Text className={`text-[20px] font-bold ${isIncreaseDisabled ? 'text-gray-400' : ''}`}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
