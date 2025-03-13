import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TProduct } from './types';

type TSavedProducts = {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product: TProduct;
};

export type SavedProductResponse = {
  savedProducts: TSavedProducts[];
};

export const useGetSavedProducts = () => {
  return createQuery<SavedProductResponse, void, AxiosError>({
    queryKey: [QueryKey.SAVED],
    fetcher: async () => {
      try {
        const response = await client({
          url: `api/product/save`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken()?.access}`,
          },
        });
        return response?.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
