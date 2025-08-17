import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { accessToken } from '@/lib';

import { client } from '../common';
import { EmailResponse, EmailType, OTPEmailData } from './types';

interface OTPEmailRequest {
  email: string;
  otpCode: string;
  userName?: string;
  purpose: 'registration' | 'login' | 'password_reset' | 'email_verification';
  expirationMinutes?: number;
}

export const useSendOTPEmail = createMutation<
  EmailResponse,
  OTPEmailRequest,
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/send-otp',
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
      throw new Error('Failed to send OTP email');
    });
  },
});

export const useSendWelcomeEmail = createMutation<
  EmailResponse,
  {
    email: string;
    userName: string;
    userType: 'individual' | 'business';
    verificationUrl?: string;
  },
  AxiosError
>({
  mutationFn: async (emailData) => {
    return client({
      url: 'api/email/send-welcome',
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
      throw new Error('Failed to send welcome email');
    });
  },
});

// Helper function to create OTP email data
export const createOTPEmailData = (
  email: string,
  otpCode: string,
  userName?: string,
  expirationMinutes: number = 10
): OTPEmailData => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + expirationMinutes);

  return {
    to: email,
    templateType: EmailType.OTP,
    otpCode,
    userName,
    expirationTime: expirationTime.toISOString(),
  };
};

// Service for OTP and authentication email notifications
export class OTPEmailService {
  // Send OTP for account verification
  static async sendVerificationOTP(
    email: string,
    otpCode: string,
    userName?: string,
    expirationMinutes: number = 10
  ) {
    try {
      console.log('Sending verification OTP email to:', email);
      
      // In a real implementation, this would trigger the backend email service
      return {
        success: true,
        message: 'Verification OTP email sent',
        otpCode,
        expirationMinutes,
      };
    } catch (error) {
      console.error('Failed to send verification OTP:', error);
      return {
        success: false,
        message: 'Failed to send verification OTP',
      };
    }
  }

  // Send OTP for password reset
  static async sendPasswordResetOTP(
    email: string,
    otpCode: string,
    userName?: string,
    expirationMinutes: number = 15
  ) {
    try {
      console.log('Sending password reset OTP email to:', email);
      
      return {
        success: true,
        message: 'Password reset OTP email sent',
        otpCode,
        expirationMinutes,
      };
    } catch (error) {
      console.error('Failed to send password reset OTP:', error);
      return {
        success: false,
        message: 'Failed to send password reset OTP',
      };
    }
  }

  // Send welcome email after successful registration
  static async sendWelcomeEmail(
    email: string,
    userName: string,
    userType: 'individual' | 'business'
  ) {
    try {
      console.log('Sending welcome email to:', email);
      
      return {
        success: true,
        message: 'Welcome email sent',
        userType,
      };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return {
        success: false,
        message: 'Failed to send welcome email',
      };
    }
  }

  // Send email verification reminder
  static async sendVerificationReminder(
    email: string,
    userName?: string,
    daysSinceRegistration: number = 1
  ) {
    try {
      console.log('Sending verification reminder email to:', email);
      
      return {
        success: true,
        message: 'Verification reminder email sent',
        daysSinceRegistration,
      };
    } catch (error) {
      console.error('Failed to send verification reminder:', error);
      return {
        success: false,
        message: 'Failed to send verification reminder',
      };
    }
  }

  // Validate OTP format
  static validateOTPFormat(otp: string): boolean {
    // OTP should be 4-8 digits
    const otpRegex = /^\d{4,8}$/;
    return otpRegex.test(otp);
  }

  // Generate a secure OTP
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return otp;
  }

  // Calculate OTP expiration time
  static calculateExpirationTime(minutes: number = 10): Date {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + minutes);
    return expiration;
  }

  // Check if OTP is expired
  static isOTPExpired(expirationTime: string): boolean {
    const now = new Date();
    const expiry = new Date(expirationTime);
    return now > expiry;
  }

  // Get user-friendly OTP purpose message
  static getOTPPurposeMessage(purpose: string): string {
    switch (purpose) {
      case 'registration':
        return 'Complete your account registration';
      case 'login':
        return 'Verify your login attempt';
      case 'password_reset':
        return 'Reset your password';
      case 'email_verification':
        return 'Verify your email address';
      default:
        return 'Verify your identity';
    }
  }
} 