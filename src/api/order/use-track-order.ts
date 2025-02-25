import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TOrderResponse } from './types';

type Response = TOrderResponse;
type Variables = {
  orderId: string | number;
};

export const useTrackOrder = createQuery<Response, Variables, AxiosError>({
  queryKey: [QueryKey.TRACK_ORDER],
  fetcher: ({ orderId }) =>
    client
      .get(`api/orders/${orderId}/track`, {
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
