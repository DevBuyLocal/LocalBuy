import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TDeal } from './types';

type Response = { data: TDeal[] };

export const useGetDeals = () => {
  return createQuery<Response, void, AxiosError>({
    queryKey: [QueryKey.DEALS],
    fetcher: async () => {
      try {
        const response = await client({
          url: `api/deals`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken()?.access}`,
          },
        });
        return response?.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
