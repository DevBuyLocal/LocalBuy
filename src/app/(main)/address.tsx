import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAddAddress } from '@/api/auth/use-add-address';
import Container from '@/components/general/container';
import { accessToken, useAuth } from '@/lib/auth';
import ControlledCustomInput from '@/components/general/controlled-custom-input';
import CustomButton from '@/components/general/custom-button';
import InputView from '@/components/general/input-view';
import { Pressable, Text, View } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

// Address input schema matching backend response
const addressSchema = z.object({
  addressLine1: z
    .string({ required_error: 'Street address is required' })
    .min(5, { message: 'Street address must be at least 5 characters' })
    .max(100, { message: 'Street address must be less than 100 characters' })
    .regex(/^[a-zA-Z0-9\s\-\.\,]+$/, { 
      message: 'Street address can only contain letters, numbers, spaces, hyphens, dots, and commas' 
    }),
  addressLine2: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, {
      message: 'Address line 2 must be less than 50 characters'
    })
    .refine((val) => !val || /^[a-zA-Z0-9\s\-\.\,]+$/.test(val), {
      message: 'Address line 2 can only contain letters, numbers, spaces, hyphens, dots, and commas'
    }),
  city: z
    .string({ required_error: 'City is required' })
    .min(2, { message: 'City must be at least 2 characters' })
    .max(50, { message: 'City must be less than 50 characters' })
    .regex(/^[a-zA-Z\s]+$/, { 
      message: 'City can only contain letters and spaces' 
    }),
  stateProvince: z
    .string({ required_error: 'State/Province is required' })
    .min(2, { message: 'State/Province must be at least 2 characters' })
    .max(50, { message: 'State/Province must be less than 50 characters' })
    .regex(/^[a-zA-Z\s]+$/, { 
      message: 'State/Province can only contain letters and spaces' 
    }),
  postalCode: z
    .string({ required_error: 'Postal code is required' })
    .min(3, { message: 'Postal code must be at least 3 characters' })
    .max(10, { message: 'Postal code must be less than 10 characters' })
    .regex(/^[0-9]+$/, { 
      message: 'Postal code can only contain numbers' 
    }),
  country: z
    .string({ required_error: 'Country is required' })
    .min(2, { message: 'Country must be at least 2 characters' })
    .max(50, { message: 'Country must be less than 50 characters' })
    .regex(/^[a-zA-Z\s]+$/, { 
      message: 'Country can only contain letters and spaces' 
    }),
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .regex(/^\+?[0-9\s\-\(\)]+$/, { 
      message: 'Phone number can only contain numbers, spaces, hyphens, parentheses, and plus sign' 
    })
    .refine((val) => {
      const cleanNumber = val.replace(/[\s\-\(\)]/g, '');
      return cleanNumber.length === 11;
    }, {
      message: 'Phone number must be exactly 11 digits'
    }),
  addressType: z.string().default('SHIPPING'),
});

type AddressFormType = z.infer<typeof addressSchema>;

export default function AddressInput() {
  const { email, userType } = useLocalSearchParams();
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: true,
  });
  const { push, replace, canGoBack, back } = useRouter();
  const { mutate: addAddress } = useAddAddress();
  const { user, setUser } = useAuth();
  
  console.log('📍 Address input page loaded');
  console.log('📍 Params:', { email, userType });
  console.log('📍 Navigation successful to address page');
  
  const {
    handleSubmit,
    control,
  } = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
      addressType: 'SHIPPING',
    },
  });
  
  const onSubmit = (data: AddressFormType) => {
    setLoading(true);
    
    // Debug: Check if we have a valid token
    console.log('📍 Address submission - Current token:', accessToken()?.access ? 'Present' : 'Missing');
    console.log('📍 Address submission - Token value:', accessToken()?.access);
    
    // Always attempt to save address - it's compulsory
    console.log('📍 Attempting to save address with data:', data);
    
    // Save the address using the add address API
    addAddress(
      {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: data.postalCode,
        country: data.country,
        phoneNumber: data.phoneNumber,
        addressType: data.addressType,
      },
      {
        onSuccess() {
          setSuccess('Address saved successfully');
          setLoading(false);
          
          // Immediately update user state to prevent redirect loop
          if (user) {
            console.log('📍 Updating user state - before:', { hasAddress: user.hasAddress, requiresAddress: user.requiresAddress });
            const updatedUser = {
              ...user,
              hasAddress: true,
              requiresAddress: false,
            };
            setUser(updatedUser);
            console.log('📍 User state updated - after:', { hasAddress: updatedUser.hasAddress, requiresAddress: updatedUser.requiresAddress });
          } else {
            console.log('📍 No user found in Zustand store to update');
          }
          
          // Navigate to home page using replace to avoid back navigation issues
          replace('/');
        },
        onError(error: any) {
          console.log('🚀 ~ Address save error:', error);
          setError(error?.response?.data || 'Failed to save address');
          setLoading(false);
        },
      }
    );
  };
  
  return (
    <Container.Page
      showHeader={false}
    >
      <InputView>
        <View className="flex-1 px-5">
                    <View className="mt-8">
            <Text className="w-4/5 text-[25px] font-bold">
              Let's add your address
            </Text>
            <Text className="mt-2 text-[16px] opacity-75">
              This helps us deliver your orders to the right location.
            </Text>
          </View>
          
          <ControlledCustomInput<AddressFormType>
            name="addressLine1"
            placeholder="Address line 1"
            containerClass="mt-10"
            control={control}
          />
          
          <ControlledCustomInput<AddressFormType>
            name="addressLine2"
            placeholder="Address line 2 (optional)"
            control={control}
          />
          
          <View className="flex-row space-x-2">
            <View className="flex-1">
              <ControlledCustomInput<AddressFormType>
                name="city"
                placeholder="City"
                control={control}
              />
            </View>
            <View className="flex-1 ml-2">
              <ControlledCustomInput<AddressFormType>
                name="stateProvince"
                placeholder="State/Province"
                control={control}
              />
            </View>
          </View>
          
          <View className="flex-row space-x-2">
            <View className="flex-1">
              <ControlledCustomInput<AddressFormType>
                name="postalCode"
                placeholder="Postal code"
                keyboardType="numeric"
                control={control}
              />
            </View>
            <View className="flex-1 ml-2">
              <ControlledCustomInput<AddressFormType>
                name="country"
                placeholder="Country"
                control={control}
              />
            </View>
          </View>
          
          <ControlledCustomInput<AddressFormType>
            name="phoneNumber"
            placeholder="Delivery phone number"
            keyboardType="phone-pad"
            description="Enter your phone number for delivery updates"
            control={control}
          />
          
          {/* Bottom section with button */}
          <View className="mt-auto pt-8">
            <CustomButton
              label="Complete Setup"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
          </View>
        </View>
      </InputView>
    </Container.Page>
  );
} 