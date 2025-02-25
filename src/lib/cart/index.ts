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
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number, removeOnZero?: boolean) => void;
  addNote: (itemId: number, note: string) => void;
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
        addToCart: (payload: Partial<TCartItem>) => {
          const { products_in_cart } = get();
          const exists = products_in_cart.find(
            (item) => item.id === payload.id
          );
          if (exists) return;
          const newItem: TCartItem = {
            id: 0,
            quantity: 1,
            note: '',
            ...payload,
          } as TCartItem;
          get().calculateTotalPrice(
            products_in_cart.length ? [...products_in_cart, newItem] : [newItem]
          );
          set({
            products_in_cart: [...products_in_cart, newItem],
            total: products_in_cart.length + 1,
          });
        },
        removeFromCart: (itemId: number) => {
          const { products_in_cart } = get();
          get().calculateTotalPrice(products_in_cart);
          set({
            products_in_cart: products_in_cart.filter(
              (item: any) => item.id !== itemId
            ),
            total: products_in_cart.length - 1,
          });
        },
        increaseQuantity: (itemId: number) => {
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
        decreaseQuantity: (itemId: number, removeOnZero = true) => {
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
        addNote: (itemId: number, note: string) => {
          const { products_in_cart } = get();
          const newProduct = products_in_cart.map((item) =>
            item.id === itemId ? { ...item, note } : item
          );
          set({
            products_in_cart: newProduct.filter((item) => item.quantity > 0),
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

export const removeFromCart = (itemId: number) =>
  _useCart.getState().removeFromCart(itemId);

export const increaseQuantity = (itemId: number) =>
  _useCart.getState().increaseQuantity(itemId);

export const decreaseQuantity = (itemId: number, removeOnZero?: boolean) =>
  _useCart.getState().decreaseQuantity(itemId, removeOnZero);

export const addNote = (itemId: number, note: string) =>
  _useCart.getState().addNote(itemId, note);

export const calculateTotalPrice = (item: any[]) =>
  _useCart.getState().calculateTotalPrice(item);

export const clearCart = () => _useCart.getState().clearCart();
