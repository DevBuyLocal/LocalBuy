import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { createSelectors } from '../utils';

interface CartState {
  products_in_cart: any[];
  total: number;
  quantity: number;
  cart_loaded: false;
  addToCart: (payload: any) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

const _useCart = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        quantity: 1,
        products_in_cart: [],
        cart_loaded: false,
        total: 0,
        addToCart: (payload: any) => {
          const { products_in_cart } = get();
          const exists = products_in_cart.find(
            (item: any) => item.id === payload.id
          );
          if (exists) return;
          set({
            products_in_cart: [
              ...products_in_cart,
              { ...payload, quantity: 1 },
            ],
          });
        },
        removeFromCart: (itemId: string) => {
          const { products_in_cart } = get();
          set({
            products_in_cart: products_in_cart.filter(
              (item: any) => item.id !== itemId
            ),
          });
        },
        increaseQuantity: (itemId: string) => {
          const { products_in_cart } = get();
          set({
            products_in_cart: products_in_cart.map((item: any) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        },
        decreaseQuantity: (itemId: string) => {
          const { products_in_cart } = get();
          set({
            products_in_cart: products_in_cart
              .map((item: any) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item: any) => item.quantity > 0), // Remove items with quantity <= 0
          });
        },
        calculateTotal: () => {
          const { products_in_cart } = get();
          const total = products_in_cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          set({ total });
        },
        clearCart: () => {
          set({ products_in_cart: [] });
        },
      }),
      { name: 'cartState', storage: createJSONStorage(() => AsyncStorage) }
    )
  )
);

export const useCart = createSelectors(_useCart);

export const addToCart = (payload: any) =>
  _useCart.getState().addToCart(payload);

export const removeFromCart = (itemId: string) =>
  _useCart.getState().removeFromCart(itemId);

export const increaseQuantity = (itemId: string) =>
  _useCart.getState().increaseQuantity(itemId);

export const decreaseQuantity = (itemId: string) =>
  _useCart.getState().decreaseQuantity(itemId);

export const calculateTotal = () => _useCart.getState().calculateTotal();

export const clearCart = () => _useCart.getState().clearCart();
