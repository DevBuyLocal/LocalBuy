import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailResponse, EmailType, ProfileUpdateEmailData } from './types';

interface ProfileUpdateEmailRequest {
  email: string;
  userName?: string;
  updatedFields: string[];
  updateTime?: string;
  ipAddress?: string;
  device?: string;
}

export const useSendProfileUpdateEmail = createMutation<
  EmailResponse,
  ProfileUpdateEmailRequest,
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/profile-update',
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
      throw new Error('Failed to send profile update email');
    });
  },
});

export const useSendEmailChangeConfirmation = createMutation<
  EmailResponse,
  {
    oldEmail: string;
    newEmail: string;
    userName?: string;
    confirmationCode?: string;
  },
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/email-change-confirmation',
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
      throw new Error('Failed to send email change confirmation');
    });
  },
});

export const useSendAccountSecurityAlert = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    alertType: 'login_from_new_device' | 'password_change' | 'email_change' | 'profile_update';
    details: {
      ipAddress?: string;
      device?: string;
      location?: string;
      timestamp: string;
    };
  },
  AxiosError
>({
  mutationFn: async (alertData) => {
    return client({
      url: 'api/email/security-alert',
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
      throw new Error('Failed to send security alert');
    });
  },
});

// Helper function to create profile update email data
export const createProfileUpdateEmailData = (
  email: string,
  userName: string,
  updatedFields: string[]
): ProfileUpdateEmailData => {
  return {
    to: email,
    templateType: EmailType.PROFILE_UPDATE,
    userName,
    updatedFields,
    updateTime: new Date().toISOString(),
  };
};

// Service for profile update email notifications
export class ProfileUpdateEmailService {
  // Map of field names to user-friendly descriptions
  private static fieldDescriptions: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    businessName: 'Business Name',
    businessPhone: 'Business Phone',
    cac: 'CAC Number',
    address: 'Address',
    city: 'City',
    state: 'State',
    country: 'Country',
    profilePicture: 'Profile Picture',
    preferences: 'Notification Preferences',
    password: 'Password',
  };

  // Send profile update notification
  static async sendUpdateNotification(
    email: string,
    userName: string,
    updatedFields: string[],
    _metadata?: {
      ipAddress?: string;
      device?: string;
      location?: string;
    }
  ) {
    try {
      const friendlyFields = updatedFields.map(
        field => this.fieldDescriptions[field] || field
      );

      console.log('Sending profile update notification to:', email);
      console.log('Updated fields:', friendlyFields);
      
      // In a real implementation, this would trigger the backend email service
      return {
        success: true,
        message: 'Profile update notification sent',
        updatedFields: friendlyFields,
      };
    } catch (error) {
      console.error('Failed to send profile update notification:', error);
      return {
        success: false,
        message: 'Failed to send profile update notification',
      };
    }
  }

  // Send security alert for sensitive changes
  static async sendSecurityAlert(
    email: string,
    userName: string,
    alertType: 'email_change' | 'password_change' | 'sensitive_info_change',
    _details: {
      ipAddress?: string;
      device?: string;
      location?: string;
      changedFields?: string[];
    }
  ) {
    try {
      console.log('Sending security alert to:', email);
      console.log('Alert type:', alertType);
      
      return {
        success: true,
        message: 'Security alert sent',
        alertType,
      };
    } catch (error) {
      console.error('Failed to send security alert:', error);
      return {
        success: false,
        message: 'Failed to send security alert',
      };
    }
  }

  // Send email verification for email changes
  static async sendEmailChangeVerification(
    newEmail: string,
    userName: string,
    verificationCode: string
  ) {
    try {
      console.log('Sending email change verification to:', newEmail);
      
      return {
        success: true,
        message: 'Email change verification sent',
        verificationCode,
      };
    } catch (error) {
      console.error('Failed to send email change verification:', error);
      return {
        success: false,
        message: 'Failed to send email change verification',
      };
    }
  }

  // Determine if changes are security-sensitive
  static isSensitiveChange(updatedFields: string[]): boolean {
    const sensitiveFields = ['email', 'password', 'phone', 'businessPhone'];
    return updatedFields.some(field => sensitiveFields.includes(field));
  }

  // Get appropriate email template based on updated fields
  static getEmailTemplate(updatedFields: string[]): string {
    if (updatedFields.includes('email')) {
      return 'email_change_security_alert';
    } else if (updatedFields.includes('password')) {
      return 'password_change_confirmation';
    } else if (this.isSensitiveChange(updatedFields)) {
      return 'sensitive_profile_update';
    } else {
      return 'general_profile_update';
    }
  }
} 