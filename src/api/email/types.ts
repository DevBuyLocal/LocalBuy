export interface EmailTemplate {
  subject: string;
  body: string;
  type: EmailType;
}

export enum EmailType {
  OTP = 'otp',
  PASSWORD_RESET = 'password_reset',
  PASSWORD_CHANGE_CONFIRMATION = 'password_change_confirmation',
  PROFILE_UPDATE = 'profile_update',
  ABANDONED_CART = 'abandoned_cart',
  PRODUCT_SAVED = 'product_saved',
  ORDER_CONFIRMATION = 'order_confirmation',
  WELCOME = 'welcome',
}

export interface BaseEmailData {
  to: string;
  templateType: EmailType;
  userType?: 'individual' | 'business';
}

export interface OTPEmailData extends BaseEmailData {
  templateType: EmailType.OTP;
  otpCode: string;
  expirationTime?: string;
  userName?: string;
}

export interface PasswordResetEmailData extends BaseEmailData {
  templateType: EmailType.PASSWORD_RESET;
  resetCode: string;
  expirationTime?: string;
  userName?: string;
}

export interface PasswordChangeConfirmationEmailData extends BaseEmailData {
  templateType: EmailType.PASSWORD_CHANGE_CONFIRMATION;
  userName?: string;
  changeTime: string;
  ipAddress?: string;
  device?: string;
}

export interface ProfileUpdateEmailData extends BaseEmailData {
  templateType: EmailType.PROFILE_UPDATE;
  userName?: string;
  updatedFields: string[];
  updateTime: string;
}

export interface AbandonedCartEmailData extends BaseEmailData {
  templateType: EmailType.ABANDONED_CART;
  userName?: string;
  cartItems: CartItemForEmail[];
  totalAmount: number;
  cartUrl: string;
  abandonedTime: string;
}

export interface ProductSavedEmailData extends BaseEmailData {
  templateType: EmailType.PRODUCT_SAVED;
  userName?: string;
  productName: string;
  productId: number;
  productImage?: string;
  productPrice: number;
  productUrl: string;
  savedTime: string;
}

export interface WelcomeEmailData extends BaseEmailData {
  templateType: EmailType.WELCOME;
  userName: string;
  userType: 'individual' | 'business';
  verificationUrl?: string;
}

export interface CartItemForEmail {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  productUrl: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export type EmailData = 
  | OTPEmailData 
  | PasswordResetEmailData 
  | PasswordChangeConfirmationEmailData 
  | ProfileUpdateEmailData 
  | AbandonedCartEmailData 
  | ProductSavedEmailData 
  | WelcomeEmailData;

export interface EmailScheduleData {
  emailData: EmailData;
  scheduleTime: Date;
  recurring?: boolean;
  recurringInterval?: 'hours' | 'days' | 'weeks';
  recurringCount?: number;
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
} 