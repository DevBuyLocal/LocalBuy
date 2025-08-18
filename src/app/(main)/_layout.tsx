/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Stack, usePathname } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { queryClient, QueryKey, useGetUser } from '@/api';
import { useAddCartItem, useAddNote, useGetCartItems } from '@/api/cart';
import { useGetAllOrders } from '@/api/order';
import { useAuth, useIsFirstTime } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

export default function MainLayout() {
  const { status, token, user } = useAuth();
  const [isFirstTime] = useIsFirstTime();
  const pathname = usePathname();

  const { products_in_cart, clearCart } = useCart(CartSelector);
  const { setLoading, setError, setSuccess, setLoadingText } = useLoader({
    showLoadingPage: true,
  });

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const { user: userData } = useAuth();
  const { isLoading: userLoading } = useGetUser();
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
      console.log('🛒 Cart Sync Debug:', {
        productsInCartLength: products_in_cart.length,
        hasToken: !!token,
        backendItemsLength: data?.data?.items?.length || 0,
        localItems: products_in_cart.map(item => item?.productOption?.id),
        backendItems: data?.data?.items?.map((item: any) => item?.productOption?.id) || []
      });
      
      // Only sync if there are local cart items that need to be synced
      // This prevents clearing the cart when navigating back from checkout
      if (products_in_cart.length && token) {
        console.log('🔄 Starting cart sync...');
        setLoading(true);
        setLoadingText('Syncing cart items...');
        
        // Get existing backend cart items
        const backendItemIds = data?.data?.items?.map((item: any) => item?.productOption?.id) || [];
        
        // Check if any local items need syncing
        const itemsToSync = products_in_cart.filter(item => 
          !backendItemIds.includes(item?.productOption?.id)
        );
        
        if (itemsToSync.length > 0) {
          console.log(`🔄 Syncing ${itemsToSync.length} new items...`);
          
          // Sync items that don't exist in backend cart
          for (let item of itemsToSync) {
            console.log('➕ Syncing new item:', item?.productOption?.id);
            await syncCartItems({
              productOptionId: item?.productOption?.id,
              quantity: item?.quantity,
            });
            
            // Add note if present
            if (item.note) {
              // Fetch updated cart to get the new item's ID
              const updatedCart: any = await queryClient.fetchQuery({
                queryKey: [QueryKey.CART],
              });
              const newCartItem = updatedCart?.data?.items?.find(
                (cartItem: any) => cartItem.productOption?.id === item?.productOption?.id
              );
              if (newCartItem) {
                await addNoteMutate({
                  cartItemId: newCartItem?.id,
                  note: item.note,
                });
              }
            }
          }
          
          setSuccess('Cart items synced');
          console.log('🗑️ Clearing local cart after sync...');
          clearCart();
          
          // Refresh cart data
          await queryClient.fetchQuery({
            queryKey: [QueryKey.CART],
          });
        } else {
          console.log('✅ All local items already exist in backend - no sync needed');
          // Don't clear local cart if no items to sync - user might be returning from checkout
        }
      } else {
        console.log('⏭️ Skipping cart sync - no local items or not logged in');
      }
    })();
  }, [
    addNoteMutate,
    clearCart,
    data?.data?.items,
    products_in_cart,
    setLoading,
    setLoadingText,
    setSuccess,
    syncCartItems,
    token,
  ]);
  console.log('📍 MainLayout Debug:', {
    isFirstTime,
    hasToken: !!token?.access,
    userData: userData ? { 
      isVerified: userData.isVerified, 
      email: userData.email, 
      hasAddress: userData.hasAddress, 
      requiresAddress: userData.requiresAddress 
    } : null,
    userLoading,
    status,
    pathname,
  });

  if (isFirstTime) {
    console.log('📍 Redirecting to onboarding');
    return <Redirect href="/onboarding" />;
  }
  
  // Check if user needs to add address - redirect to address page (prioritize this over login redirect)
  // Only redirect if we're not already on the address page to prevent infinite loops
  if (userData && userData.requiresAddress && !userLoading && status !== 'idle' && !pathname.includes('/address')) {
    console.log('📍 Redirecting to address - user needs to add address');
    return <Redirect href={`/address?email=${encodeURIComponent(userData.email)}&userType=${userData.type}`} />;
  }

  // Redirect unverified users to login page (but not if they're on auth pages)
  if (!token?.access && !pathname.includes('/(auth)')) {
    console.log('📍 Redirecting to login - no token');
    return <Redirect href="/login" />;
  }

  // Check if user is verified - redirect to verification page if not verified
  // Only redirect if we're not already on the verify page to prevent infinite loops
  if (userData && !userData.isVerified && !userLoading && status !== 'idle' && !pathname.includes('/verify')) {
    console.log('📍 Redirecting to verify - user not verified');
    return <Redirect href={`/verify?email=${encodeURIComponent(userData.email)}`} />;
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
      <Stack.Screen name="address" options={{ headerShown: false }} />
      <Stack.Screen name="payment-link" options={{ headerShown: false }} />
      <Stack.Screen name="contact-support" options={{ headerShown: false }} />
      <Stack.Screen name="submit-feedback" options={{ headerShown: false }} />
      <Stack.Screen name="feedback-thank-you" options={{ headerShown: false }} />
      <Stack.Screen name="support-requests" options={{ headerShown: false }} />
      <Stack.Screen name="support-request-detail" options={{ headerShown: false }} />
    </Stack>
  );
}
