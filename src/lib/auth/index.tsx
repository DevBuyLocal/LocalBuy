import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { type TUser } from '@/api/user/types';

import { setKeepSignedIn } from '../utility';
import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
  user: TUser | null;
  setUser: (user: TUser | null) => void;
}

const _useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        status: 'idle',
        token: null,
        user: null,
        signIn: (token) => {
          console.log('📍 Auth signIn called with token:', token);
          setToken(token);
          set({ status: 'signIn', token });
          console.log('📍 Auth state updated - status: signIn, token set');
        },
        signOut: () => {
          removeToken();
          setUser(null);
          setKeepSignedIn(false);
          // queryClient.removeQueries({ queryKey: [QueryKey.USER] });
          set({ status: 'signOut', token: null });
        },
        setUser: (user) => set({ user }),
        hydrate: () => {
          try {
            console.log('📍 Auth hydrate called');
            const userToken = getToken();
            console.log('📍 Retrieved token from storage:', userToken);
            if (userToken !== null && userToken.access) {
              console.log('📍 Valid token found, signing in');
              get().signIn(userToken);
            } else {
              console.log('📍 No valid token found, signing out');
              get().signOut();
            }
          } catch (e) {
            console.log('📍 Auth hydrate error:', e);
            // catch error here
            // Maybe sign_out user!
          }
        },
      }),
      { name: 'authState', storage: createJSONStorage(() => AsyncStorage) }
    )
  )
);

export const AuthSelector = (state: AuthState) => state;

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const setUser = (user: TUser | null) =>
  _useAuth.getState().setUser(user);
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
export const accessToken = () => _useAuth.getState().token;
