import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TOrder } from './types';

type Response = { order: Omit<TOrder, 'transactions'> };
type Variables = { orderId: string | number };

export const useGetSingleOrder = (orderId: string | number) => {
  return createQuery<Response, Variables, AxiosError>({
    queryKey: [QueryKey.ORDER, 'single', orderId],
    fetcher: () =>
      client
        .get(`api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken()?.access}`,
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            return response?.data;
          }
          return null;
        })
        .catch((error: any) => {
          return error;
        }),
    gcTime: 20, // 1 hour
    staleTime: 20, // 1 hour
    enabled: !!accessToken()?.access,
  });
};
