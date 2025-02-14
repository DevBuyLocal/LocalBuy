import { type AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common/client';
import { DEFAULT_LIMIT, getNextPageParam } from '../common/utils';
import { type PaginateQuery, QueryKey } from '../types';
import { type TProduct } from './types';

type Response = PaginateQuery<TProduct>;
type Variables = { query?: string };

export const useSearchProducts = (_variables: Variables) => {
  return createInfiniteQuery<Response, Variables, AxiosError>({
    queryKey: [QueryKey.PRODUCTS, _variables.query], // Include type to avoid caching conflicts
    fetcher: async (_, { pageParam }) => {
      try {
        const token = accessToken()?.access;
        return await client({
          url: `api/product/search`,
          method: 'GET',
          params: {
            limit: DEFAULT_LIMIT,
            page: pageParam,
            type: _variables.query,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).then((response) => response?.data);
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: getNextPageParam as any,
    initialPageParam: 1,
  });
};
