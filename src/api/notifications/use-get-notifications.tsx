import { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { QueryKey } from '../types';

export type TNotification = {
  createdAt: string;
  id: number;
  isRead: boolean;
  message: string;
  title: string;
  updatedAt: string;
  userId: number;
  type: any;
};

export type NotificationResponse = { data: TNotification[]; count: number };

export const useGetNotifications = () => {
  return createQuery<NotificationResponse, void, AxiosError>({
    queryKey: [QueryKey.NOTIFICATIONS],
    fetcher: async () => {
      try {
        const response = await client({
          url: `api/notifications/user`,
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
