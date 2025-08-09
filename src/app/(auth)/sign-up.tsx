import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegister } from '@/api';
import Container from '@/components/general/container';
import ControlledCustomInput from '@/components/general/controlled-custom-input';
import CustomButton from '@/components/general/custom-button';
import InputView from '@/components/general/input-view';
import { Pressable, Text, View, ProgressBar } from '@/components/ui';
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
  
  // Clean up stored form data when component unmounts
  useEffect(() => {
    return () => {
      // Clear stored form data when navigating away
      AsyncStorage.removeItem('businessFormData').catch(console.log);
      AsyncStorage.removeItem('individualFormData').catch(console.log);
    };
  }, []);
  
  // Use conditional types based on user role
  const BusinessForm = () => {
    const {
      handleSubmit,
      control,
      formState: { isSubmitting, errors },
      setValue,
      getValues,
      reset,
      setError: setFieldError,
      clearErrors,
      watch,
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
    
    // Progress bar ref for submission progress
    const progressRef = useRef<any>(null);
    
    // Watch form values for persistence
    const formValues = watch();
    
    // Save form data to AsyncStorage whenever it changes
    useEffect(() => {
      const saveFormData = async () => {
        try {
          await AsyncStorage.setItem('businessFormData', JSON.stringify(formValues));
        } catch (error) {
          console.log('Error saving form data:', error);
        }
      };
      
      // Only save if there's actual data
      if (Object.values(formValues).some(value => value && value.toString().trim() !== '')) {
        saveFormData();
      }
    }, [formValues]);
    
    // Restore form data from AsyncStorage on component mount
    useEffect(() => {
      const restoreFormData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('businessFormData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.keys(parsedData).forEach((key) => {
              if (parsedData[key] && parsedData[key].toString().trim() !== '') {
                setValue(key as keyof BusinessRegFormType, parsedData[key]);
              }
            });
          }
        } catch (error) {
          console.log('Error restoring form data:', error);
        }
      };
      
      restoreFormData();
    }, [setValue]);
    
    const onSubmit = (data: BusinessRegFormType) => {
      setLoading(true);
      // Clear any previous field errors
      clearErrors();
      
      // Start progress bar animation
      if (progressRef.current) {
        progressRef.current.setProgress(0);
        // Animate progress to 90% during submission
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.setProgress(90);
          }
        }, 100);
      }
      
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
            // Complete progress bar
            if (progressRef.current) {
              progressRef.current.setProgress(100);
            }
            setSuccess('Account Created Successfully! Please check your email for verification.');
            console.log('📍 Registration response:', responseData);
            // Clear stored form data on successful submission
            AsyncStorage.removeItem('businessFormData').catch(console.log);
            // Add a small delay to show the success message before redirecting
            setTimeout(() => {
              push(
                `/verify?email=${encodeURIComponent(data.email)}&userType=${role}`
              );
            }, 1500);
          },
          onError(error) {
            // Reset progress bar on error
            if (progressRef.current) {
              progressRef.current.setProgress(0);
            }
            const errorData = error?.response?.data;
            setError(errorData);
            
            // Handle field-specific validation errors from server
            if (errorData && typeof errorData === 'object' && errorData !== null) {
              const errorObj = errorData as Record<string, any>;
              
              // Check for password-related errors and clear password fields
              if (errorObj.password || errorObj.confirmPassword) {
                setFieldError('password', { type: 'server', message: errorObj.password || 'Password error occurred' });
                setFieldError('confirmPassword', { type: 'server', message: errorObj.confirmPassword || 'Password confirmation error occurred' });
                // Clear password fields for security
                setValue('password', '');
                setValue('confirmPassword', '');
              }
              
              // Check for other field validation errors
              if (errorObj.email) {
                setFieldError('email', { type: 'server', message: errorObj.email });
              }
              if (errorObj.fullName) {
                setFieldError('fullName', { type: 'server', message: errorObj.fullName });
              }
              if (errorObj.businessName) {
                setFieldError('businessName', { type: 'server', message: errorObj.businessName });
              }
              if (errorObj.businessPhone) {
                setFieldError('businessPhone', { type: 'server', message: errorObj.businessPhone });
              }
              if (errorObj.cac) {
                setFieldError('cac', { type: 'server', message: errorObj.cac });
              }
              if (errorObj.howDidYouFindUs) {
                setFieldError('howDidYouFindUs', { type: 'server', message: errorObj.howDidYouFindUs });
              }
              
              // Handle general server errors (like "User already exists")
              if (errorObj.message && !Object.keys(errorObj).some(key => 
                ['email', 'password', 'confirmPassword', 'fullName', 'businessName', 'businessPhone', 'cac', 'howDidYouFindUs'].includes(key)
              )) {
                // This is a general error, not field-specific
                setError(errorObj.message);
              }
            } else if (typeof errorData === 'string') {
              // Handle string error messages
              setError(errorData);
            }
            
            // Don't clear the form - let the user see their input and fix errors
            // The form will show validation errors for specific fields
          },
          onSettled() {
            setLoading(false);
          },
        }
      );
    };
    
    const handleResetForm = () => {
      // Show confirmation dialog
      if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
        reset();
        clearErrors();
        // Clear stored form data
        AsyncStorage.removeItem('businessFormData').catch(console.log);
        setSuccess('Form cleared successfully');
      }
    };
    
    const clearField = (fieldName: keyof BusinessRegFormType) => {
      setValue(fieldName, '');
      clearErrors(fieldName);
    };
    
    const saveProgress = async () => {
      try {
        setLoading(true);
        const currentValues = getValues();
        await AsyncStorage.setItem('businessFormData', JSON.stringify(currentValues));
        setSuccess('Progress saved successfully!');
      } catch (error) {
        setError('Failed to save progress');
      } finally {
        setLoading(false);
      }
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
            {loading && (
              <View className="mb-4">
                <ProgressBar ref={progressRef} className="w-full" />
                <Text className="text-center mt-2 text-sm opacity-75">Creating your account...</Text>
              </View>
            )}
            <CustomButton
              label={loading ? "Creating account..." : "Create account"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
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
      formState: { isSubmitting, errors },
      setValue,
      getValues,
      reset,
      setError: setFieldError,
      clearErrors,
      watch,
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
    
    // Progress bar ref for submission progress
    const progressRef = useRef<any>(null);
    
    // Watch form values for persistence
    const formValues = watch();
    
    // Save form data to AsyncStorage whenever it changes
    useEffect(() => {
      const saveFormData = async () => {
        try {
          await AsyncStorage.setItem('individualFormData', JSON.stringify(formValues));
        } catch (error) {
          console.log('Error saving form data:', error);
        }
      };
      
      // Only save if there's actual data
      if (Object.values(formValues).some(value => value && value.toString().trim() !== '')) {
        saveFormData();
      }
    }, [formValues]);
    
    // Restore form data from AsyncStorage on component mount
    useEffect(() => {
      const restoreFormData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('individualFormData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.keys(parsedData).forEach((key) => {
              if (parsedData[key] && parsedData[key].toString().trim() !== '') {
                setValue(key as keyof IndividualRegFormType, parsedData[key]);
              }
            });
          }
        } catch (error) {
          console.log('Error restoring form data:', error);
        }
      };
      
      restoreFormData();
    }, [setValue]);
    
    const onSubmit = (data: IndividualRegFormType) => {
      setLoading(true);
      // Clear any previous field errors
      clearErrors();
      
      // Start progress bar animation
      if (progressRef.current) {
        progressRef.current.setProgress(0);
        // Animate progress to 90% during submission
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.setProgress(90);
          }
        }, 100);
      }
      
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
            // Complete progress bar
            if (progressRef.current) {
              progressRef.current.setProgress(100);
            }
            setSuccess('Account Created Successfully! Please check your email for verification.');
            // Clear stored form data on successful submission
            AsyncStorage.removeItem('individualFormData').catch(console.log);
            // Add a small delay to show the success message before redirecting
            setTimeout(() => {
              push(
                `/verify?email=${encodeURIComponent(data.email)}&userType=${role}`
              );
            }, 1500);
          },
          onError(error) {
            // Reset progress bar on error
            if (progressRef.current) {
              progressRef.current.setProgress(0);
            }
            const errorData = error?.response?.data;
            setError(errorData);
            
            // Handle field-specific validation errors from server
            if (errorData && typeof errorData === 'object' && errorData !== null) {
              const errorObj = errorData as Record<string, any>;
              
              // Check for password-related errors and clear password fields
              if (errorObj.password || errorObj.confirmPassword) {
                setFieldError('password', { type: 'server', message: errorObj.password || 'Password error occurred' });
                setFieldError('confirmPassword', { type: 'server', message: errorObj.confirmPassword || 'Password confirmation error occurred' });
                // Clear password fields for security
                setValue('password', '');
                setValue('confirmPassword', '');
              }
              
              // Check for other field validation errors
              if (errorObj.email) {
                setFieldError('email', { type: 'server', message: errorObj.email });
              }
              if (errorObj.fullName) {
                setFieldError('fullName', { type: 'server', message: errorObj.fullName });
              }
              if (errorObj.deliveryPhone || errorObj.phone) {
                setFieldError('deliveryPhone', { type: 'server', message: errorObj.deliveryPhone || errorObj.phone });
              }
              if (errorObj.dob) {
                setFieldError('dob', { type: 'server', message: errorObj.dob });
              }
              if (errorObj.howDidYouFindUs) {
                setFieldError('howDidYouFindUs', { type: 'server', message: errorObj.howDidYouFindUs });
              }
              
              // Handle general server errors (like "User already exists")
              if (errorObj.message && !Object.keys(errorObj).some(key => 
                ['email', 'password', 'confirmPassword', 'fullName', 'deliveryPhone', 'phone', 'dob', 'howDidYouFindUs'].includes(key)
              )) {
                // This is a general error, not field-specific
                setError(errorObj.message);
              }
            } else if (typeof errorData === 'string') {
              // Handle string error messages
              setError(errorData);
            }
            
            // Don't clear the form - let the user see their input and fix errors
            // The form will show validation errors for specific fields
          },
          onSettled() {
            setLoading(false);
          },
        }
      );
    };
    
    const handleResetForm = () => {
      // Show confirmation dialog
      if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
        reset();
        clearErrors();
        // Clear stored form data
        AsyncStorage.removeItem('individualFormData').catch(console.log);
        setSuccess('Form cleared successfully');
      }
    };
    
    const clearField = (fieldName: keyof IndividualRegFormType) => {
      setValue(fieldName, '');
      clearErrors(fieldName);
    };
    
    const saveProgress = async () => {
      try {
        setLoading(true);
        const currentValues = getValues();
        await AsyncStorage.setItem('individualFormData', JSON.stringify(currentValues));
        setSuccess('Progress saved successfully!');
      } catch (error) {
        setError('Failed to save progress');
      } finally {
        setLoading(false);
      }
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
              description="Use format: YYYY-MM-DD (e.g., 1990-12-25)"
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
            {loading && (
              <View className="mb-4">
                <ProgressBar ref={progressRef} className="w-full" />
                <Text className="text-center mt-2 text-sm opacity-75">Creating your account...</Text>
              </View>
            )}
            <CustomButton
              label={loading ? "Creating account..." : "Create account"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
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
