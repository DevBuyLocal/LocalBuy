import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TOrder } from './types';

type Response = { order: Omit<TOrder, 'transactions'> };
type Variables = { orderId: string | number };

export const useGetSingleOrder = createQuery<Response, Variables, AxiosError>({
  queryKey: [QueryKey.ORDER],
  fetcher: (variables) =>
    client
      .get(`api/orders/${variables.orderId}`, {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response?.data;
        }
        return null;
      })
      .catch((error: any) => {
        return error;
      }),
  enabled: !!accessToken()?.access,
});
