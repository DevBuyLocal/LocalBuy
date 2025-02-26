/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { queryClient, QueryKey, useGetUser } from '@/api';
import { useAddCartItem, useAddNote, useGetCartItems } from '@/api/cart';
import { useGetAllOrders } from '@/api/order';
import { useAuth, useIsFirstTime } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

export default function MainLayout() {
  const { status, token } = useAuth();
  const [isFirstTime] = useIsFirstTime();

  const { products_in_cart, clearCart } = useCart(CartSelector);
  const { setLoading, setError, setSuccess, setLoadingText } = useLoader({
    showLoadingPage: true,
  });

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useGetUser();
  const { data } = useGetCartItems();
  useGetAllOrders();

  const { mutateAsync: syncCartItems } = useAddCartItem({
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutateAsync: addNoteMutate } = useAddNote({
    onError(error) {
      setError(error?.response?.data);
    },
    onSettled() {
      setLoading(false);
    },
  });
  // const { mutateAsync: UpdateNoteMutate } = useUpdateNote({
  //   onError(error) {
  //     setError(error?.response?.data);
  //   },
  //   onSettled() {
  //     setLoading(false);
  //   },
  // });

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
        if (token) {
          queryClient.fetchQuery({ queryKey: [QueryKey.USER] });
          queryClient.fetchQuery({ queryKey: [QueryKey.CART] });
          queryClient.fetchQuery({ queryKey: [QueryKey.ORDERS] });
        }
      }, 1000);
    }
  }, [hideSplash, status, token]);

  useEffect(() => {
    (async () => {
      if (products_in_cart.length && token) {
        setLoading(true);
        setLoadingText('Syncing cart items...');
        for (let item of products_in_cart) {
          await syncCartItems({
            productOptionId: item?.productOption?.id,
            quantity: item?.quantity,
          });
          if (data?.items) {
            await Promise.all(
              data.items.map(async (cartItem) => {
                if (cartItem.productOption?.id === item?.productOption?.id) {
                  if (item.note) {
                    await addNoteMutate({
                      cartItemId: cartItem?.id,
                      note: item.note,
                    });
                  }
                }
              })
            );
          }
        }
        setSuccess('Cart items synced');
        clearCart();
        queryClient.fetchQuery({
          queryKey: [QueryKey.USER, QueryKey.CART],
        });
      }
    })();
  }, [
    addNoteMutate,
    clearCart,
    data?.items,
    products_in_cart,
    setLoading,
    setLoadingText,
    setSuccess,
    syncCartItems,
    token,
  ]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  // if (status === 'signOut') {
  //   return <Redirect href="/login" />;
  // }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="all-products" options={{ headerShown: false }} />
      <Stack.Screen name="all-brands" options={{ headerShown: false }} />
      <Stack.Screen
        name="(account-pages)/main-account-page"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="walkthrough" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="schedule-order" options={{ headerShown: false }} />
      <Stack.Screen name="track-order" options={{ headerShown: false }} />
      <Stack.Screen
        name="order-success"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="complete-profile"
        options={{ headerShown: false, presentation: 'containedModal' }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="add-product"
        options={{ headerShown: false, presentation: 'containedModal' }}
      />
      <Stack.Screen name="style" options={{ headerShown: false }} />
    </Stack>
  );
}
