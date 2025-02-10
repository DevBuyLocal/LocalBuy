// DEFINE AVAILABLE USER TYPES
export const userType: { name: string; value: 'individual' | 'business' }[] = [
  { name: 'Individual', value: 'individual' },
  { name: 'Business Owner', value: 'business' },
];

export type UserTypeProps = {
  value: 'individual' | 'business';
};
