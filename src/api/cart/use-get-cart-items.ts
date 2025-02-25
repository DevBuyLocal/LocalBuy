import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TCartItemResPonse } from './types';

type Response = TCartItemResPonse;

export const useGetCartItems = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.CART],
  fetcher: () =>
    client
      .get('api/cart', {
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
