import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TOrderResponse } from './types';

type Response = { orders: TOrderResponse };

export const useGetAllOrders = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.ORDERS],
  fetcher: () =>
    client
      .get('api/orders', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          return response?.data;
        }
        return [];
      })
      .catch((error: any) => {
        return error;
      }),
  enabled: !!accessToken()?.access,
});
