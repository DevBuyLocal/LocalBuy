import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  referralCode: string;
};

export interface TValidateReferralResponse {
  message: string;
  isValid: boolean;
}

export const useValidateReferral = createMutation<
  TValidateReferralResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: 'api/auth/validate-referral',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
