import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken, setUser, signOut } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type TUser } from './types';

type Response = TUser;
export const useGetUser = createQuery<Response, void, AxiosError>({
  queryKey: [QueryKey.USER],
  fetcher: () => {
    console.log('📍 GetUser fetcher called');
    console.log('📍 GetUser accessToken:', accessToken()?.access ? 'Present' : 'Missing');
    return client
      .get('api/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken()?.access}`,
        },
      })
      .then((response) => {
        console.log('📍 GetUser API response status:', response.status);
        console.log('📍 GetUser API response data:', response?.data);
        console.log('📍 GetUser API response data.data:', response?.data?.data);
        console.log('📍 GetUser API response data.data.profile:', response?.data?.data?.profile);
        if (response.status === 200) {
          console.log('📍 Setting user in Zustand store');
          setUser(response?.data?.data);
          console.log('📍 User set in Zustand store');
        }
        return response?.data?.data;
      })
      .catch((error: any) => {
        console.log('📍 GetUser API error:', error);
        console.log('📍 GetUser API error status:', error?.status);
        console.log('📍 GetUser API error response:', error?.response);
        //SiGN USER OUT IF UNAUTHORIZED
        if (error.status >= 400 && error?.status < 500) {
          signOut();
        }
        return error;
      });
  },
  enabled: !!accessToken()?.access,
  staleTime: 30000, // 30 seconds - prevent excessive refetching
});
