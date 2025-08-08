import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { type UserType } from '@/lib/constants';

import { client } from '../common';

type Variables = {
  email: string;
  type: UserType;
  phone?: string;
  referal_code: string | undefined;
  password: string;
  // Business-specific fields
  fullName?: string;
  businessName?: string;
  cac?: string;
  businessPhone?: string;
  howDidYouFindUs?: string;
  // Individual-specific fields
  deliveryPhone?: string;
  dob?: string;
};

export interface TRegisterResponse {
  message: string;
  response: RegResponse;
}

export interface RegResponse {
  id: number;
  email: string;
  isVerified: boolean;
  type: string;
  code: string;
  token: string;
}

// type Response = {
//   data: TRegisterResponse;
// };

export const useRegister = createMutation<
  TRegisterResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: 'api/auth/register',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
