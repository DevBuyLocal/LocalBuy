import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailResponse } from './types';

export interface SupportRequestEmailData {
  to: string;
  templateType: 'support_request_confirmation' | 'support_request_update';
  userName?: string;
  ticketId: string;
  category: string;
  description: string;
  status?: string;
  adminResolutionNote?: string;
  submissionTime?: string;
  updateTime?: string;
}

export const useSupportRequestEmail = createMutation<
  EmailResponse,
  SupportRequestEmailData,
  AxiosError
>({
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
      throw new Error('Failed to send support email');
    });
  },
});
