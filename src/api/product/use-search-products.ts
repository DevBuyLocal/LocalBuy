import { type AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common/client';
import { DEFAULT_LIMIT, getNextPageParam } from '../common/utils';
import { QueryKey } from '../types';
import { type TProduct } from './types';

export type PaginateQueryProduct<T> = {
  data: T[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
  };
};

type SearchApiResponse = {
  data: TProduct[];
  success: boolean;
  message: string;
  searchQuery: string;
  filters: {
    sortBy: string;
    sortOrder: string;
  };
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type Response = SearchApiResponse;
// type Response = PaginateQueryProduct<TProduct>;
type Variables = {
  query?: string;
  type?: string;
  limit?: number;
  page?: number;
};

export const useSearchProducts = (_variables: Variables) => {
  return createInfiniteQuery<Response, Variables, AxiosError>({
    queryKey: [QueryKey.PRODUCTS, _variables.query], // Include type to avoid caching conflicts
    fetcher: async () => {
      try {
        const { limit = DEFAULT_LIMIT, page, type } = _variables;

        return await client({
          url: `api/product/search`,
          method: 'GET',
          params: {
            limit,
            page,
            type,
            query: _variables.query,
          },
        }).then((response) => response?.data);
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: getNextPageParam as any,
    initialPageParam: 1,
    enabled: Boolean(_variables.query),
  });
};
