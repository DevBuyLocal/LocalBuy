import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useRegister } from '@/api';
import Container from '@/components/general/container';
import ControlledCustomInput from '@/components/general/controlled-custom-input';
import CustomButton from '@/components/general/custom-button';
import InputView from '@/components/general/input-view';
import { Pressable, Text, View } from '@/components/ui';
import { type UserType } from '@/lib/constants';
import { useLoader } from '@/lib/hooks/general/use-loader';

import { type RegFormType, type BusinessRegFormType, type IndividualRegFormType, regSchema, businessRegSchema, individualRegSchema } from './types';

export default function SignUp() {
  const { role }: { role: UserType } = useLocalSearchParams();
  const { loading, setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: true,
  });
  const { push, replace, canGoBack, back } = useRouter();
  const { mutate: Register } = useRegister();
  
  const isBusinessOwner = role === 'business';
  
  // Use conditional types based on user role
  const BusinessForm = () => {
    const {
      handleSubmit,
      control,
      formState: { isSubmitting },
    } = useForm<BusinessRegFormType>({
      resolver: zodResolver(businessRegSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
        refer: undefined,
        fullName: '',
        businessName: '',
        cac: '',
        businessPhone: '',
        howDidYouFindUs: '',
      },
      mode: 'onChange',
    });
    
    const onSubmit = (data: BusinessRegFormType) => {
      setLoading(true);
      Register(
        {
          email: data.email.toLowerCase(),
          password: data.password,
          type: role,
          referal_code: data.refer,
          fullName: data.fullName,
          businessName: data.businessName,
          businessPhone: data.businessPhone,
          howDidYouFindUs: data.howDidYouFindUs,
          ...(data.cac && data.cac.trim() && { cac: data.cac }),
        },
        {
          onSuccess(responseData) {
            setSuccess('Account Created Successfully ');
            console.log('📍 Registration response:', responseData);
            push(
              `/verify?email=${encodeURIComponent(data.email)}&userType=${role}`
            );
          },
          onError(error) {
            setError(error?.response?.data);
          },
          onSettled() {
            setLoading(false);
          },
        }
      );
    };
    
    return (
      <InputView>
        <View className="flex-1 px-5">
          <Text className="w-4/5 text-[25px] font-bold">
            Let's get you signed up and shopping.
          </Text>
          <Text className="mt-2  text-[16px] opacity-75">
            Enter your business details to get started
          </Text>
          
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <ControlledCustomInput<BusinessRegFormType>
              name="fullName"
              placeholder="Full name"
              containerClass="mt-10"
              control={control}
            />
            <ControlledCustomInput<BusinessRegFormType>
              name="businessName"
              placeholder="Business name"
              control={control}
            />
            <ControlledCustomInput<BusinessRegFormType>
              name="businessPhone"
              placeholder="Business phone number"
              keyboardType="phone-pad"
              description="Enter 11-digit phone number (e.g., 08012345678)"
              control={control}
            />
            <ControlledCustomInput<BusinessRegFormType>
              name="cac"
              placeholder="CAC number (optional)"
              control={control}
            />
          </MotiView>
          
          <ControlledCustomInput<BusinessRegFormType>
            name="email"
            placeholder="Business email"
            containerClass="mt-5"
            keyboardType="email-address"
            control={control}
          />
          <ControlledCustomInput<BusinessRegFormType>
            name="password"
            isPassword
            placeholder="Password"
            control={control}
          />
          <AnimatePresence>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 350 }}
            >
              <ControlledCustomInput<BusinessRegFormType>
                name="confirmPassword"
                isPassword
                placeholder="Confirm password"
                description="Must contain at least 6 characters, include uppercase, lowercase letters, and a number."
                control={control}
              />
              <ControlledCustomInput<BusinessRegFormType>
                name="refer"
                placeholder="Referral code (optional)"
                containerClass="mt-5"
                control={control}
              />
            </MotiView>
          </AnimatePresence>
          
          {/* Bottom section with button */}
          <View className="mt-auto pt-8">
            <CustomButton
              label="Create account"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
            <Pressable
              className="mt-2 flex-row self-center"
              onPress={() => replace('/login')}
            >
              <Text className="color-[#121212BF]">Already have an account? </Text>
              <Text className="color-primaryText">Login</Text>
            </Pressable>
          </View>
        </View>
      </InputView>
    );
  };
  
  // Individual form
  const IndividualForm = () => {
    const {
      handleSubmit,
      control,
      formState: { isSubmitting },
    } = useForm<IndividualRegFormType>({
      resolver: zodResolver(individualRegSchema),
      defaultValues: {
        email: '',
        password: '',
        confirmPassword: '',
        refer: undefined,
        fullName: '',
        deliveryPhone: '',
        dob: '',
        howDidYouFindUs: '',
      },
      mode: 'onChange',
    });
    
    const onSubmit = (data: IndividualRegFormType) => {
      setLoading(true);
      Register(
        {
          email: data.email.toLowerCase(),
          password: data.password,
          type: role,
          referal_code: data.refer,
          fullName: data.fullName,
          phone: data.deliveryPhone, // Map deliveryPhone to phone for API
          ...(data.dob && data.dob.trim() && { dob: data.dob }),
          ...(data.howDidYouFindUs && data.howDidYouFindUs.trim() && { howDidYouFindUs: data.howDidYouFindUs }),
        },
        {
          onSuccess(responseData) {
            setSuccess('Account Created Successfully ');
            push(
              `/verify?email=${encodeURIComponent(data.email)}&userType=${role}`
            );
          },
          onError(error) {
            setError(error?.response?.data);
          },
          onSettled() {
            setLoading(false);
          },
        }
      );
    };
    
    return (
      <InputView>
        <View className="flex-1 px-5">
          <Text className="w-4/5 text-[25px] font-bold">
            Let's get you signed up and shopping.
          </Text>
          <Text className="mt-2  text-[16px] opacity-75">
            Enter your personal details to get started
          </Text>
          
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <ControlledCustomInput<IndividualRegFormType>
              name="fullName"
              placeholder="Full name"
              containerClass="mt-10"
              control={control}
            />
            <ControlledCustomInput<IndividualRegFormType>
              name="deliveryPhone"
              placeholder="Phone number"
              keyboardType="phone-pad"
              description="Enter 11-digit phone number (e.g., 08012345678)"
              control={control}
            />
            <ControlledCustomInput<IndividualRegFormType>
              name="dob"
              placeholder="Date of birth (optional)"
              control={control}
            />
          </MotiView>
          
          <ControlledCustomInput<IndividualRegFormType>
            name="email"
            placeholder="Email address"
            containerClass="mt-5"
            keyboardType="email-address"
            control={control}
          />
          <ControlledCustomInput<IndividualRegFormType>
            name="password"
            isPassword
            placeholder="Password"
            control={control}
          />
          <AnimatePresence>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 350 }}
            >
              <ControlledCustomInput<IndividualRegFormType>
                name="confirmPassword"
                isPassword
                placeholder="Confirm password"
                description="Must contain at least 6 characters, include uppercase, lowercase letters, and a number."
                control={control}
              />
              <ControlledCustomInput<IndividualRegFormType>
                name="howDidYouFindUs"
                placeholder="How did you find us? (optional)"
                control={control}
              />
              <ControlledCustomInput<IndividualRegFormType>
                name="refer"
                placeholder="Referral code (optional)"
                containerClass="mt-5"
                control={control}
              />
            </MotiView>
          </AnimatePresence>
          
          {/* Bottom section with button */}
          <View className="mt-auto pt-8">
            <CustomButton
              label="Create account"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            />
            <Pressable
              className="mt-2 flex-row self-center"
              onPress={() => replace('/login')}
            >
              <Text className="color-[#121212BF]">Already have an account? </Text>
              <Text className="color-primaryText">Login</Text>
            </Pressable>
          </View>
        </View>
      </InputView>
    );
  };
  
  return (
    <Container.Page
      showHeader
      headerTitle="Create an account"
      backPress={() => {
        if (canGoBack()) {
          back();
        } else {
          replace('/');
        }
      }}
    >
      {isBusinessOwner ? <BusinessForm /> : <IndividualForm />}
    </Container.Page>
  );
}
