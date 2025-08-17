import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client, queryClient } from '../common';
import { ProductSaveEmailService } from '../email/use-product-save-email';
import { QueryKey } from '../types';

type Variables = {
  productId: number;
};

export interface TAddCartResponse {}

export const useSaveProduct = createMutation<
  TAddCartResponse,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) => {
    return client({
      url: 'api/product/save',
      method: 'POST',
      data: variables,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then(async (response) => {
      if (response.status === 201) {
        // Send product save email notification
        try {
          // Get user data for email
          const userQuery = queryClient.getQueryData(['user']);
          if (userQuery && (userQuery as any)?.email) {
            const userData = userQuery as any;
            
            // Get product data - this would typically come from the response or cache
            const productData = {
              id: variables.productId,
              name: 'Product', // This should be fetched from product cache or response
              price: 0, // This should be fetched from product cache or response
              image: '', // This should be fetched from product cache or response
            };

            await ProductSaveEmailService.sendSaveConfirmation(
              userData.email,
              userData.fullName || userData.businessName || 'User',
              productData
            );
          }
        } catch (error) {
          console.log('Failed to send product save email:', error);
        }

        await queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === QueryKey.SAVED;
          },
        });
        await queryClient.fetchQuery({
          queryKey: [QueryKey.SAVED],
        });
        return response.data;
      }
    });
  },
});
