import { type AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TSingleManufacturers } from './types';

export type PaginateQueryManufacturer<T> = {
  data: T[];
  pagination: {
    totalManufacturers: number;
    totalPages: number;
    currentPage: number;
  };
};

type Response = PaginateQueryManufacturer<TSingleManufacturers>;
type Variables = { limit?: number; page?: number };

export const useGetManufacturers = (_variables: Variables) => {
  return createInfiniteQuery<Response, Variables, AxiosError>({
    queryKey: [QueryKey.MANUFACTURERS],
    fetcher: async (_, { pageParam }) => {
      try {
        return await client({
          url: `api/manufactures`,
          method: 'GET',
          params: {
            limit: _variables?.limit || 10,
            page: pageParam,
          },
        }).then((response) => response?.data);
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (lastPage: any) => lastPage.pagination.currentPage + 1,
    getPreviousPageParam: (lastPage: any) =>
      lastPage.pagination.currentPage - 1,
    initialPageParam: 1,
  });
};
