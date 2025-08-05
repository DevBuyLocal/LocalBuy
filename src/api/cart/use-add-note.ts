import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { QueryKey } from '../types';

type Variables = {
  cartItemId: number;
  note: string;
};

export interface TAddNoteResponse {}

export const useAddNote = createMutation<
  TAddNoteResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/cart/note`,
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      console.log('🚀 ~ response:', response);
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.CART] });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.CART],
        });
        return response.data;
      }
    }),
});
