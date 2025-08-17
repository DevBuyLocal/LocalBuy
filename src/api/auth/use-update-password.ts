import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { PasswordChangeEmailService } from '../email/use-password-change-email';

type Variables = {
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
};

export const useUpdatePassword = createMutation<any, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/reset-password',
      method: 'POST',
      data: variables,
    }).then(async (response) => {
      // Send password change confirmation email
      try {
        if (response.status === 200 && variables.email) {
          await PasswordChangeEmailService.sendResetConfirmation(
            variables.email,
            'User', // userName not available, using default
            {
              ipAddress: undefined, // Could be obtained from request headers
              device: navigator.userAgent || 'Unknown device',
              resetMethod: 'email',
            }
          );
        }
      } catch (error) {
        console.log('Failed to send password reset confirmation email:', error);
      }
      
      return response.data;
    }),
});
