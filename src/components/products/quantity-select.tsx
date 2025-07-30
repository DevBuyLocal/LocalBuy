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
import Ionicons from '@expo/vector-icons/Ionicons';

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
        'flex-row items-center justify-between overflow-hidden rounded-[8px] px-3 py-2 border border-gray-200 bg-white',
        props.containerClass
      )}
      {...props}
    >
      <Pressable 
        onPress={handleDecrease} 
        hitSlop={15}
        className={`flex-row items-center justify-center w-8 h-8 rounded-full ${
          isDecreaseDisabled 
            ? 'bg-gray-100 opacity-50' 
            : 'bg-gray-100 active:bg-gray-200'
        }`}
        disabled={isDecreaseDisabled}
      >
        <Ionicons 
          name="remove" 
          size={16} 
          color={isDecreaseDisabled ? '#9CA3AF' : '#374151'} 
        />
      </Pressable>
      
      <View className="flex-row items-center justify-center min-w-[40px]">
      {loading ? (
          <ActivityIndicator size="small" color="#374151" />
      ) : (
          <Text className="text-[18px] font-semibold text-gray-900">
          {localQuantity}
        </Text>
      )}
      </View>

      <Pressable 
        onPress={handleIncrease} 
        hitSlop={15}
        className={`flex-row items-center justify-center w-8 h-8 rounded-full ${
          isIncreaseDisabled 
            ? 'bg-gray-100 opacity-50' 
            : 'bg-gray-100 active:bg-gray-200'
        }`}
        disabled={isIncreaseDisabled}
      >
        <Ionicons 
          name="add" 
          size={16} 
          color={isIncreaseDisabled ? '#9CA3AF' : '#374151'} 
        />
      </Pressable>
    </View>
  );
}

export default QuantitySelect;
