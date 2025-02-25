import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { createSelectors } from '../utils';
interface TUtility {
  recent_search: string[];
  addToRecent: (value: string) => void;
  clearRecent: () => void;
  filters: { brands?: string[]; categories?: string[] };
  addFilters: ({
    brands,
    categories,
  }: {
    brands?: string[];
    categories?: string[];
  }) => void;
  clearFilters: () => void;
}

const _useUtility = create<TUtility>()(
  devtools(
    persist(
      (set, get) => ({
        recent_search: [],
        filters: { brands: [], categories: [] },
        addToRecent: (value: string) => {
          const { recent_search } = get();
          set({ recent_search: [value, ...recent_search].slice(0, 8) });
        },
        clearRecent: () => {
          set({ recent_search: [] });
        },
        addFilters: ({ brands, categories }) => {
          set({ filters: { brands, categories } });
        },
        clearFilters: () => {
          set({ filters: { brands: [], categories: [] } });
        },
      }),
      {
        name: 'utilityState',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
export const UtilitySelector = (state: TUtility) => state;

export const useUtility = createSelectors(_useUtility);
