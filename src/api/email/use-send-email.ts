import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailData, EmailResponse } from './types';

export const useSendEmail = createMutation<EmailResponse, EmailData, AxiosError>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/send',
      method: 'POST',
      data: emailData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to send email');
    });
  },
});

export const useSendScheduledEmail = createMutation<
  EmailResponse,
  { emailData: EmailData; scheduleTime: Date },
  AxiosError
>({
  mutationFn: async ({ emailData, scheduleTime }) => {
    return client({
      url: 'api/email/schedule',
      method: 'POST',
      data: {
        ...emailData,
        scheduleTime: scheduleTime.toISOString(),
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to schedule email');
    });
  },
}); 