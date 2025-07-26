import { Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

/**
 * Validates full name input
 * @param name - The full name to validate
 * @returns string | null - Error message if invalid, null if valid
 */
export function validateFullName(name: string): string | null {
  if (!name.trim()) {
    return 'Full name is required';
  }
  
  // Check for numbers and special characters (except spaces, hyphens, and apostrophes)
  const invalidChars = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  
  if (invalidChars.test(name)) {
    return 'Full name should only contain letters, spaces, hyphens, and apostrophes';
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(name)) {
    return 'Full name should not contain consecutive spaces';
  }
  
  // Check for leading or trailing spaces
  if (name !== name.trim()) {
    return 'Full name should not start or end with spaces';
  }
  
  // Check minimum length (at least 2 characters)
  if (name.trim().length < 2) {
    return 'Full name should be at least 2 characters long';
  }
  
  return null;
}

/**
 * Validates phone number input
 * @param phone - The phone number to validate
 * @returns string | null - Error message if invalid, null if valid
 */
export function validatePhoneNumber(phone: string): string | null {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  
  // Check for non-numeric characters (except spaces, hyphens, and plus sign)
  const invalidChars = /[a-zA-Z!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;
  
  if (invalidChars.test(phone)) {
    return 'Phone number should only contain numbers, spaces, hyphens, and plus sign';
  }
  
  // Remove spaces, hyphens, and plus sign for length check
  const cleanPhone = phone.replace(/[\s\-+]/g, '');
  
  // Check if it's all numbers after cleaning
  if (!/^\d+$/.test(cleanPhone)) {
    return 'Phone number should only contain numbers';
  }
  
  // Check for exactly 11 digits
  if (cleanPhone.length !== 11) {
    return 'Phone number must be exactly 11 digits';
  }
  
  return null;
}

/**
 * Validates business address input
 * @param address - The business address to validate
 * @returns string | null - Error message if invalid, null if valid
 */
export function validateBusinessAddress(address: string): string | null {
  if (!address.trim()) {
    return null; // Optional field, no error if empty
  }
  
  // Check for special characters (except spaces, hyphens, apostrophes, and periods)
  const invalidChars = /[!@#$%^&*()_+=\[\]{};':"\\|,<>\/?]/;
  
  if (invalidChars.test(address)) {
    return 'Business address should not contain special characters';
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(address)) {
    return 'Business address should not contain consecutive spaces';
  }
  
  // Check for leading or trailing spaces
  if (address !== address.trim()) {
    return 'Business address should not start or end with spaces';
  }
  
  // Check minimum length (at least 5 characters)
  if (address.trim().length < 5) {
    return 'Business address should be at least 5 characters long';
  }
  
  return null;
}

/**
 * Validates CAC number input
 * @param cac - The CAC number to validate
 * @returns string | null - Error message if invalid, null if valid
 */
export function validateCACNumber(cac: string): string | null {
  if (!cac.trim()) {
    return null; // Optional field, no error if empty
  }
  
  // Check for special characters (except hyphens and spaces)
  const invalidChars = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/;
  
  if (invalidChars.test(cac)) {
    return 'CAC number should not contain special characters';
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(cac)) {
    return 'CAC number should not contain consecutive spaces';
  }
  
  // Check for leading or trailing spaces
  if (cac !== cac.trim()) {
    return 'CAC number should not start or end with spaces';
  }
  
  // Check minimum length (at least 3 characters)
  if (cac.trim().length < 3) {
    return 'CAC number should be at least 3 characters long';
  }
  
  return null;
}
