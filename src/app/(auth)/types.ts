import * as z from 'zod';

export const regSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/\d/, { message: 'Password must contain at least one number' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    refer: z.string().optional(),
    // Business-specific fields
    fullName: z.string().optional(),
    businessName: z.string().optional(),
    cac: z.string().optional(),
    businessPhone: z.string().optional(),
    howDidYouFindUs: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Business registration schema with required fields
export const businessRegSchema = z
  .object({
    email: z
      .string({ required_error: 'Business email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/\d/, { message: 'Password must contain at least one number' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, { message: 'Full name must be at least 2 characters long' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Full name can only contain letters and spaces',
      }),
    businessName: z
      .string({ required_error: 'Business name is required' })
      .min(2, { message: 'Business name must be at least 2 characters long' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Business name can only contain letters and spaces',
      }),
    cac: z.string().optional(),
    businessPhone: z
      .string({ required_error: 'Business phone is required' })
      .refine((phone) => {
        if (!phone.trim()) return false;
        const invalidChars = /[a-zA-Z!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;
        if (invalidChars.test(phone)) return false;
        const cleanPhone = phone.replace(/[\s\-+]/g, '');
        if (!/^\d+$/.test(cleanPhone)) return false;
        return cleanPhone.length === 11;
      }, {
        message: 'Phone number must be exactly 11 digits and contain only numbers, spaces, hyphens, and plus sign',
      }),
    howDidYouFindUs: z.string().optional(),
    refer: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Individual registration schema with required fields
export const individualRegSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/\d/, { message: 'Password must contain at least one number' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, { message: 'Full name must be at least 2 characters long' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Full name can only contain letters and spaces',
      }),
    deliveryPhone: z
      .string({ required_error: 'Phone number is required' })
      .refine((phone) => {
        if (!phone.trim()) return false;
        const invalidChars = /[a-zA-Z!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;
        if (invalidChars.test(phone)) return false;
        const cleanPhone = phone.replace(/[\s\-+]/g, '');
        if (!/^\d+$/.test(cleanPhone)) return false;
        return cleanPhone.length === 11;
      }, {
        message: 'Phone number must be exactly 11 digits and contain only numbers, spaces, hyphens, and plus sign',
      }),
    dob: z.string().optional(),
    howDidYouFindUs: z.string().optional(),
    refer: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type RegFormType = z.infer<typeof regSchema>;
export type BusinessRegFormType = z.infer<typeof businessRegSchema>;
export type IndividualRegFormType = z.infer<typeof individualRegSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;

export default {
  regSchema,
  businessRegSchema,
  loginSchema,
};
