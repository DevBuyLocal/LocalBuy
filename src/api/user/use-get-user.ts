import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { accessToken, useAuth } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';
import { type User } from './types';

type Response = {
  data: User;
};

// export const useGetUseri = createMutation<Response, void, AxiosError>({
//   mutationFn: async () =>
//     client
//       .get('api/auth/me', {
//         headers: {
//           Authorization: `Bearer ${accessToken()?.access}`,
//         },
//       })
//       .then((response) => response.data),
//   onSuccess(data) {
//     const setUser = useAuth.use.setUser();
//     setUser(data?.data);
//   },
// });

export const useGetUser = () => {
  const token = accessToken()?.access;
  return useQuery<Response, void, AxiosError>({
    queryKey: [QueryKey.USER],
    queryFn: () =>
      client({
        url: 'api/auth/me',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          const setUser = useAuth.use.setUser();
          setUser(response?.data);
        }
        return response.data;
      }),
    // if (!token) throw new Error('No access token available');
    // return await client
    //   .get('/api/auth/me', {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((response) => {
    //     console.log('🚀 ~ file: use-get-user.tsx:39 ~ response:', response);
    //     if (response.status === 200) {
    //       const setUser = useAuth.use.setUser();
    //       setUser(response?.data);
    //     }
    //     return response.data;
    //   })
    //   .catch((error) => {
    //     console.log(error, 'Error');
    //   });
    enabled: !!token,
  });
};
