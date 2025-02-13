import { type AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common/client';
import { DEFAULT_LIMIT, getNextPageParam } from '../common/utils';
import { type PaginateQuery, QueryKey } from '../types';
import { type TProduct } from './types';

type Response = PaginateQuery<TProduct>;
type Variables = { type?: string };

export const useGetProducts = (_variables: Variables) => {
  return createInfiniteQuery<Response, Variables, AxiosError>({
    queryKey: [QueryKey.PRODUCTS, _variables.type], // Include type to avoid caching conflicts
    fetcher: async (_, { pageParam }) => {
      try {
        const token = accessToken()?.access;
        return await client({
          url: `api/product`,
          method: 'GET',
          params: {
            limit: DEFAULT_LIMIT,
            page: pageParam,
            type: _variables.type,
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
