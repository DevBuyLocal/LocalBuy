import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailResponse, EmailType, PasswordChangeConfirmationEmailData } from './types';

interface PasswordChangeEmailRequest {
  email: string;
  userName?: string;
  changeTime?: string;
  ipAddress?: string;
  device?: string;
  location?: string;
}

export const useSendPasswordChangeConfirmation = createMutation<
  EmailResponse,
  PasswordChangeEmailRequest,
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/password-change-confirmation',
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
      throw new Error('Failed to send password change confirmation');
    });
  },
});

export const useSendPasswordResetConfirmation = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    resetTime: string;
    ipAddress?: string;
    device?: string;
  },
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/password-reset-confirmation',
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
      throw new Error('Failed to send password reset confirmation');
    });
  },
});

export const useSendPasswordSecurityAlert = createMutation<
  EmailResponse,
  {
    email: string;
    userName?: string;
    alertType: 'suspicious_activity' | 'multiple_failed_attempts' | 'password_breach_alert';
    attempts?: number;
    lastAttemptTime?: string;
    ipAddress?: string;
    device?: string;
  },
  AxiosError
>({
  mutationFn: async (alertData) => {
    return client({
      url: 'api/email/password-security-alert',
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
      throw new Error('Failed to send password security alert');
    });
  },
});

// Helper function to create password change confirmation email data
export const createPasswordChangeConfirmationEmailData = (
  email: string,
  userName: string,
  metadata?: {
    ipAddress?: string;
    device?: string;
    location?: string;
  }
): PasswordChangeConfirmationEmailData => {
  return {
    to: email,
    templateType: EmailType.PASSWORD_CHANGE_CONFIRMATION,
    userName,
    changeTime: new Date().toISOString(),
    ipAddress: metadata?.ipAddress,
    device: metadata?.device,
  };
};

// Service for password-related email notifications
export class PasswordChangeEmailService {
  // Send password change confirmation
  static async sendChangeConfirmation(
    email: string,
    userName: string,
    metadata?: {
      ipAddress?: string;
      device?: string;
      location?: string;
      userAgent?: string;
    }
  ) {
    try {
      console.log('Sending password change confirmation to:', email);
      
      // Extract device info from user agent if available
      const deviceInfo = metadata?.userAgent ? 
        this.extractDeviceInfo(metadata.userAgent) : 
        metadata?.device || 'Unknown device';

      // In a real implementation, this would trigger the backend email service
      return {
        success: true,
        message: 'Password change confirmation sent',
        metadata: {
          changeTime: new Date().toISOString(),
          device: deviceInfo,
          ipAddress: metadata?.ipAddress,
          location: metadata?.location,
        },
      };
    } catch (error) {
      console.error('Failed to send password change confirmation:', error);
      return {
        success: false,
        message: 'Failed to send password change confirmation',
      };
    }
  }

  // Send password reset confirmation
  static async sendResetConfirmation(
    email: string,
    userName: string,
    metadata?: {
      ipAddress?: string;
      device?: string;
      resetMethod?: 'email' | 'sms' | 'security_questions';
    }
  ) {
    try {
      console.log('Sending password reset confirmation to:', email);
      
      return {
        success: true,
        message: 'Password reset confirmation sent',
        resetMethod: metadata?.resetMethod || 'email',
      };
    } catch (error) {
      console.error('Failed to send password reset confirmation:', error);
      return {
        success: false,
        message: 'Failed to send password reset confirmation',
      };
    }
  }

  // Send security alert for suspicious password activity
  static async sendSecurityAlert(
    email: string,
    userName: string,
    alertType: 'multiple_failed_attempts' | 'suspicious_login' | 'password_breach',
    details: {
      attempts?: number;
      ipAddress?: string;
      device?: string;
      location?: string;
      timeframe?: string;
    }
  ) {
    try {
      console.log('Sending password security alert to:', email);
      console.log('Alert type:', alertType);
      
      let message = '';
      switch (alertType) {
        case 'multiple_failed_attempts':
          message = `Multiple failed login attempts detected (${details.attempts || 'several'} attempts)`;
          break;
        case 'suspicious_login':
          message = 'Suspicious login activity detected from new location';
          break;
        case 'password_breach':
          message = 'Your password may have been compromised in a data breach';
          break;
        default:
          message = 'Unusual password-related activity detected';
      }

      return {
        success: true,
        message: 'Security alert sent',
        alertType,
        alertMessage: message,
        details,
      };
    } catch (error) {
      console.error('Failed to send password security alert:', error);
      return {
        success: false,
        message: 'Failed to send password security alert',
      };
    }
  }

  // Send password expiration reminder
  static async sendExpirationReminder(
    email: string,
    userName: string,
    daysUntilExpiry: number
  ) {
    try {
      console.log('Sending password expiration reminder to:', email);
      console.log('Days until expiry:', daysUntilExpiry);
      
      return {
        success: true,
        message: 'Password expiration reminder sent',
        daysUntilExpiry,
      };
    } catch (error) {
      console.error('Failed to send password expiration reminder:', error);
      return {
        success: false,
        message: 'Failed to send password expiration reminder',
      };
    }
  }

  // Extract device information from user agent
  private static extractDeviceInfo(userAgent: string): string {
    try {
      // Simple device detection - in a real app, you'd use a proper library
      if (userAgent.includes('iPhone')) return 'iPhone';
      if (userAgent.includes('iPad')) return 'iPad';
      if (userAgent.includes('Android')) return 'Android Device';
      if (userAgent.includes('Windows')) return 'Windows PC';
      if (userAgent.includes('Mac')) return 'Mac';
      if (userAgent.includes('Linux')) return 'Linux';
      
      return 'Unknown Device';
    } catch {
      return 'Unknown Device';
    }
  }

  // Check if password change is from trusted device/location
  static isTrustedChange(
    ipAddress?: string,
    device?: string,
    trustedIPs: string[] = [],
    trustedDevices: string[] = []
  ): boolean {
    if (ipAddress && trustedIPs.includes(ipAddress)) return true;
    if (device && trustedDevices.includes(device)) return true;
    return false;
  }

  // Get security risk level
  static getSecurityRiskLevel(
    metadata?: {
      ipAddress?: string;
      device?: string;
      location?: string;
      timeOfDay?: number; // Hour in 24h format
    }
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Check time of day (unusual hours increase risk)
    if (metadata?.timeOfDay) {
      if (metadata.timeOfDay < 6 || metadata.timeOfDay > 22) {
        riskScore += 1;
      }
    }

    // Check if location/IP is suspicious (this would be checked against known patterns)
    // For now, we'll use a simple check
    if (metadata?.ipAddress && metadata.ipAddress.startsWith('192.168.')) {
      riskScore -= 1; // Local IP, lower risk
    }

    if (riskScore <= 0) return 'low';
    if (riskScore <= 2) return 'medium';
    return 'high';
  }
} 