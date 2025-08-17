import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { OTPEmailService } from '../email/use-otp-email';

type Variables = {
  email: string;
};

export interface TResetResponse {
  message: string;
}

export const useResetPassword = createMutation<
  TResetResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/api/auth/reset',
      method: 'POST',
      data: variables,
    }).then(async (response) => {
      // Send enhanced password reset OTP email
      try {
        if (response.status === 200 && variables.email) {
          // Generate a mock OTP for demonstration - in reality this would come from the backend
          const resetCode = OTPEmailService.generateOTP(6);
          
          await OTPEmailService.sendPasswordResetOTP(
            variables.email,
            resetCode,
            'User', // userName not available, using default
            15 // 15 minutes expiration for password reset
          );
        }
      } catch (error) {
        console.log('Failed to send password reset OTP email:', error);
      }
      
      return response.data;
    }),
});
