import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { type TPutUser } from '../auth';
import { client, queryClient } from '../common';
import { ProfileUpdateEmailService } from '../email/use-profile-update-email';
import { QueryKey } from '../types';
import { type TUser } from './types';

type Variables = Partial<TUser & TPutUser>;
type Response = TUser;

export const useUpdateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    return client({
      url: 'api/user',
      method: 'PUT',
      data: variables,
      headers: {
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          // Send profile update email notification
          try {
            const currentUser = queryClient.getQueryData([QueryKey.USER]);
            if (currentUser && (currentUser as any)?.email) {
              const userData = currentUser as any;
              
              // Determine which fields were updated by comparing old vs new data
              const updatedFields = Object.keys(variables).filter(key => 
                (variables as any)[key] !== userData[key]
              );

              if (updatedFields.length > 0) {
                // Check if this is a sensitive change
                const isSensitive = ProfileUpdateEmailService.isSensitiveChange(updatedFields);
                
                if (isSensitive) {
                  // Send security alert for sensitive changes
                  await ProfileUpdateEmailService.sendSecurityAlert(
                    userData.email,
                    userData.fullName || userData.businessName || 'User',
                    updatedFields.includes('email') ? 'email_change' : 
                    updatedFields.includes('password') ? 'password_change' : 'sensitive_info_change',
                    {
                      ipAddress: undefined, // Could be obtained from request headers
                      device: navigator.userAgent || 'Unknown device',
                      location: undefined,
                      changedFields: updatedFields,
                    }
                  );
                } else {
                  // Send regular profile update notification
                  await ProfileUpdateEmailService.sendUpdateNotification(
                    userData.email,
                    userData.fullName || userData.businessName || 'User',
                    updatedFields,
                    {
                      ipAddress: undefined,
                      device: navigator.userAgent || 'Unknown device',
                      location: undefined,
                    }
                  );
                }
              }
            }
          } catch (error) {
            console.log('Failed to send profile update email:', error);
          }

          await queryClient.invalidateQueries({
            predicate: (query) => {
              return query.queryKey[0] === QueryKey.USER;
            },
          });
          await queryClient.refetchQueries({
            queryKey: [QueryKey.USER],
          });
        }

        return response.data;
      })
      .catch((err) => {
        console.log('🚀 ~ file: use-update-user.ts:16 ~ err:', err);
        throw err;
      });
  },
});
