import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  cartItemId: string;
};

export interface TRemoveCartItemResponse {}

export const useRemoveCartItem = createMutation<
  TRemoveCartItemResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/cart`,
      method: 'DELETE',
      data: { cartItemId: variables.cartItemId },
    }).then((response) => response.data),
});
