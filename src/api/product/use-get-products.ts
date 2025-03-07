import { type AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common/client';
import { QueryKey } from '../types';
import { type TProduct } from './types';

export type PaginateQueryProduct<T> = {
  data: T[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    // next: string | null;
    // previous: string | null;
  };
};

type Response = PaginateQueryProduct<TProduct>;
type Variables = {
  type?: string;
  limit?: number;
  page?: number;
  categoryId?: number;
  manufacturerId?: number;
};

export const useGetProducts = (_variables: Variables) => {
  return createInfiniteQuery<Response, Variables, AxiosError>({
    queryKey: [
      QueryKey.PRODUCTS,
      _variables.type,
      _variables.limit,
      _variables.page,
      _variables.categoryId,
      _variables.manufacturerId,
    ], // Include type to avoid caching conflicts
    fetcher: async (_, { pageParam }) => {
      try {
        return await client({
          url: `api/product`,
          method: 'GET',
          params: {
            limit: _variables?.limit || 5,
            page: _variables?.page || pageParam,
            type: _variables.type,
            categoryId: _variables.categoryId,
            manufacturerId: _variables.manufacturerId,
          },
          // headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).then((response) => response?.data);
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.pagination.currentPage + 1,
    getPreviousPageParam: (lastPage) => lastPage.pagination.currentPage - 1,
    initialPageParam: 1,
  });
};
