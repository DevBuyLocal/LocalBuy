import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken, setUser, signOut } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TUser } from './types';

type Response = TUser;
export const useGetUser = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.USER],
  fetcher: () =>
    client
      .get('api/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response?.data?.data);
        }

        return response?.data?.data;
      })
      .catch((error: any) => {
        //SiGN USER OUT IF UNAUTHORIZED
        if (error.status >= 400 && error?.status < 500) {
          signOut();
        }
        return error;
      }),
  enabled: !!accessToken()?.access,
});
