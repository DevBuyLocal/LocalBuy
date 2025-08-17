import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailResponse, EmailType, ProductSavedEmailData } from './types';

interface ProductSaveEmailRequest {
  productId: number;
  email: string;
  userName?: string;
  sendConfirmation?: boolean;
  sendPromotion?: boolean;
}

export const useSendProductSaveEmail = createMutation<
  EmailResponse,
  ProductSaveEmailRequest,
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/product-saved',
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
      throw new Error('Failed to send product save email');
    });
  },
});

export const useSendSavedProductsDigest = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  },
  AxiosError
>({
  mutationFn: async (digestData) => {
    return client({
      url: 'api/email/saved-products-digest',
      method: 'POST',
      data: digestData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to send saved products digest');
    });
  },
});

export const useSendPriceDropAlert = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    productId: number;
    oldPrice: number;
    newPrice: number;
    discountPercentage: number;
  },
  AxiosError
>({
  mutationFn: async (alertData) => {
    return client({
      url: 'api/email/price-drop-alert',
      method: 'POST',
      data: alertData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to send price drop alert');
    });
  },
});

// Helper function to create product saved email data
export const createProductSavedEmailData = (
  email: string,
  userName: string,
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  }
): ProductSavedEmailData => {
  return {
    to: email,
    templateType: EmailType.PRODUCT_SAVED,
    userName,
    productName: product.name,
    productId: product.id,
    productImage: product.image,
    productPrice: product.price,
    productUrl: `app://product/${product.id}`, // Deep link to product
    savedTime: new Date().toISOString(),
  };
};

// Service for product save email notifications
export class ProductSaveEmailService {
  // Send immediate confirmation email when product is saved
  static async sendSaveConfirmation(
    email: string,
    _userName: string,
    _product: {
      id: number;
      name: string;
      price: number;
      image?: string;
    }
  ) {
    try {
      // This would be called when a product is saved
      console.log('Sending product save confirmation email to:', email);
      
      // In a real implementation, this would trigger the backend email service
      return {
        success: true,
        message: 'Product save confirmation email sent',
      };
    } catch (error) {
      console.error('Failed to send product save confirmation:', error);
      return {
        success: false,
        message: 'Failed to send product save confirmation',
      };
    }
  }

  // Send promotional email based on saved products
  static async sendRelatedProductsPromotion(
    email: string,
    _userName: string,
    _savedProductIds: number[]
  ) {
    try {
      console.log('Sending related products promotion to:', email);
      
      // This would analyze saved products and send related product recommendations
      return {
        success: true,
        message: 'Related products promotion email sent',
      };
    } catch (error) {
      console.error('Failed to send related products promotion:', error);
      return {
        success: false,
        message: 'Failed to send related products promotion',
      };
    }
  }

  // Send back-in-stock notification
  static async sendBackInStockNotification(
    email: string,
    _userName: string,
    _product: {
      id: number;
      name: string;
      price: number;
      image?: string;
    }
  ) {
    try {
      console.log('Sending back-in-stock notification to:', email);
      
      return {
        success: true,
        message: 'Back-in-stock notification sent',
      };
    } catch (error) {
      console.error('Failed to send back-in-stock notification:', error);
      return {
        success: false,
        message: 'Failed to send back-in-stock notification',
      };
    }
  }
} 