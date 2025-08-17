import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { AbandonedCartEmailData, EmailResponse, EmailType } from './types';

interface AbandonedCartTrackingData {
  userId?: number;
  email: string;
  cartItems: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  abandonedAt: Date;
}

export const useTrackAbandonedCart = createMutation<
  EmailResponse,
  AbandonedCartTrackingData,
  AxiosError
>({
  mutationFn: async (trackingData) => {
    return client({
      url: 'api/email/track-abandoned-cart',
      method: 'POST',
      data: trackingData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to track abandoned cart');
    });
  },
});

export const useSendAbandonedCartEmail = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    delayHours?: number; // Default 1-2 hours
  },
  AxiosError
>({
  mutationFn: async ({ email, userName, delayHours = 2 }) => {
    return client({
      url: 'api/email/send-abandoned-cart',
      method: 'POST',
      data: {
        email,
        userName,
        delayHours,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()?.access}`,
      },
    }).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      throw new Error('Failed to send abandoned cart email');
    });
  },
});

// Helper function to create abandoned cart email data
export const createAbandonedCartEmailData = (
  email: string,
  userName: string,
  cartItems: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>,
  totalAmount: number
): AbandonedCartEmailData => {
  return {
    to: email,
    templateType: EmailType.ABANDONED_CART,
    userName,
    cartItems: cartItems.map(item => ({
      ...item,
      productUrl: `app://product/${item.id}`, // Deep link to product
    })),
    totalAmount,
    cartUrl: 'app://cart', // Deep link to cart
    abandonedTime: new Date().toISOString(),
  };
};

// Service to automatically trigger abandoned cart emails
export class AbandonedCartService {
  private static timers: Map<string, NodeJS.Timeout> = new Map();

  static startTracking(
    email: string,
    cartItems: Array<any>,
    totalAmount: number,
    delayHours: number = 2
  ) {
    // Clear existing timer for this email
    this.clearTracking(email);

    // Set new timer
    const timerId = setTimeout(() => {
      this.triggerAbandonedCartEmail(email, cartItems, totalAmount);
    }, delayHours * 60 * 60 * 1000); // Convert hours to milliseconds

    this.timers.set(email, timerId);
  }

  static clearTracking(email: string) {
    const existingTimer = this.timers.get(email);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.timers.delete(email);
    }
  }

  private static async triggerAbandonedCartEmail(
    email: string,
    _cartItems: Array<any>,
    _totalAmount: number
  ) {
    try {
      // This would typically be called from the backend
      // Here we're showing the structure for frontend integration
      console.log('Triggering abandoned cart email for:', email);
      
      // In a real implementation, this would be handled by the backend
      // The frontend would just track cart abandonment and let the server handle the email
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
    }
  }
} 