import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = { notificationId: number };

export const useReadNotification = createMutation<void, Variables, AxiosError>({
  mutationFn: async ({ notificationId }) =>
    client({
      url: `api/notifications/${notificationId}/read`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await queryClient.invalidateQueries({
          queryKey: [QueryKey.NOTIFICATIONS],
        });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.NOTIFICATIONS],
        });
      }
    }),
});
