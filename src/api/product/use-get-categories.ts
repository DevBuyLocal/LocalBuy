import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TSingleCategory } from './types';

type Response = { data: TSingleCategory[] };

export const useGetCategories = () => {
  return createQuery<Response, void, AxiosError>({
    queryKey: [QueryKey.CATEGORIES],
    fetcher: async () => {
      try {
        const response = await client({
          url: `api/product/categories`,
          method: 'GET',
        });
        return response?.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
