import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { type TCartItem } from '@/api/cart/types';

import { createSelectors } from '../utils';

interface CartState {
  products_in_cart: TCartItem[];
  total: number;
  totalPrice: number;
  quantity: number;
  cart_loaded: false;
  note: string;
  addToCart: (payload: Partial<TCartItem>) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string, removeOnZero?: boolean) => void;
  addNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  calculateTotalPrice: (item: any[]) => void;
}

const _useCart = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        quantity: 1,
        products_in_cart: [],
        cart_loaded: false,
        note: '',
        total: 0,
        totalPrice: 0,
        addToCart: (payload: any) => {
          const { products_in_cart } = get();
          const exists = products_in_cart.find(
            (item: any) => item.id === payload.id
          );
          if (exists) return;
          get().calculateTotalPrice(
            products_in_cart.length
              ? [...products_in_cart, { ...payload, quantity: 1 }]
              : [{ ...payload, quantity: 1 }]
          );
          set({
            products_in_cart: [
              ...products_in_cart,
              { ...payload, quantity: 1 },
            ],
            total: products_in_cart.length + 1,
          });
        },
        removeFromCart: (itemId: string) => {
          const { products_in_cart } = get();
          get().calculateTotalPrice(products_in_cart);
          set({
            products_in_cart: products_in_cart.filter(
              (item: any) => item.id !== itemId
            ),
            total: products_in_cart.length - 1,
          });
        },
        increaseQuantity: (itemId: string) => {
          const { products_in_cart } = get();
          get().calculateTotalPrice(products_in_cart);
          set({
            products_in_cart: products_in_cart.map((item: any) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        },
        decreaseQuantity: (itemId: string, removeOnZero = true) => {
          const { products_in_cart } = get();
          get().calculateTotalPrice(products_in_cart);
          const newProduct = products_in_cart.map((item: any) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: removeOnZero
                    ? item.quantity - 1
                    : Math.max(1, item.quantity - 1),
                }
              : item
          );
          set({
            products_in_cart: newProduct.filter(
              (item: any) => item.quantity > 0
            ), // Remove items with quantity <= 0
          });
        },
        addNote: (itemId: string, note: string) => {
          const { products_in_cart } = get();
          const newProduct = products_in_cart.map((item: any) =>
            item.id === itemId ? { ...item, note } : item
          );
          set({
            products_in_cart: newProduct.filter(
              (item: any) => item.quantity > 0
            ),
          });
        },
        calculateTotalPrice: (products_in_cart: any[]) => {
          const totalPrice = products_in_cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          set({ totalPrice });
        },
        clearCart: () => {
          set({ products_in_cart: [], total: 0, totalPrice: 0 });
        },
      }),
      { name: 'cartState', storage: createJSONStorage(() => AsyncStorage) }
    )
  )
);

export const CartSelector = (state: CartState) => state;

export const useCart = createSelectors(_useCart);

export const addToCart = (payload: any) =>
  _useCart.getState().addToCart(payload);

export const removeFromCart = (itemId: string) =>
  _useCart.getState().removeFromCart(itemId);

export const increaseQuantity = (itemId: string) =>
  _useCart.getState().increaseQuantity(itemId);

export const decreaseQuantity = (itemId: string, removeOnZero?: boolean) =>
  _useCart.getState().decreaseQuantity(itemId, removeOnZero);

export const addNote = (itemId: string, note: string) =>
  _useCart.getState().addNote(itemId, note);

export const calculateTotalPrice = (item: any[]) =>
  _useCart.getState().calculateTotalPrice(item);

export const clearCart = () => _useCart.getState().clearCart();
