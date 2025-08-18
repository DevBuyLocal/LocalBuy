import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView } from 'react-native';
import { z } from 'zod';

import { useSubmitSupportRequest, useSupportRequestEmail, useGetUser } from '@/api';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ControlledInput, ControlledSelect, Text, View } from '@/components/ui';
import type { OptionType } from '@/components/ui';

const supportCategories: OptionType[] = [
  { value: 'Product', label: 'Product Issues' },
  { value: 'Order', label: 'Order Problems' },
  { value: 'Delivery', label: 'Delivery Issues' },
  { value: 'General', label: 'General Inquiry' },
];

const schema = z.object({
  category: z.enum(['Product', 'Order', 'Delivery', 'General'], {
    required_error: 'Please select a category',
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactSupport() {
  const { back } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitSupportRequest = useSubmitSupportRequest();
  const sendSupportEmail = useSupportRequestEmail();
  const { data: userData } = useGetUser();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: undefined,
      description: '',
    },
  });

  const description = watch('description');
  const characterCount = description?.length || 0;
  const maxCharacters = 1000;

  const onSubmit = async (data: FormData) => {
    console.log('🚀 Starting support request submission...');
    console.log('📝 Form data:', {
      title: `${data.category} Support Request`,
      category: data.category,
      description: data.description,
      descriptionLength: data.description?.length
    });
    console.log('👤 User data:', {
      email: userData?.email,
      fullName: userData?.fullName,
      hasUserData: !!userData
    });

    try {
      setIsSubmitting(true);
      console.log('📤 Submitting support request to API...');
      
      const result = await submitSupportRequest.mutateAsync({
        title: `${data.category} Support Request`,
        category: data.category,
        description: data.description,
      });

      console.log('✅ Support request submitted successfully:', {
        supportId: result.data.supportId,
        requestId: result.data.id,
        status: result.data.status,
        result: result
      });

      // Send email confirmation
      if (userData?.email) {
        console.log('📧 Attempting to send confirmation email...');
        try {
          const emailResult = await sendSupportEmail.mutateAsync({
            to: userData.email,
            templateType: 'support_request_confirmation',
            userName: userData.fullName || userData.email,
            ticketId: result.data.supportId,
            category: data.category,
            description: data.description,
            submissionTime: new Date().toISOString(),
          });
          console.log('✅ Confirmation email sent successfully:', emailResult);
        } catch (emailError) {
          // Email sending failed, but request was submitted successfully
          console.warn('⚠️ Failed to send confirmation email:', emailError);
          console.error('📧 Email error details:', {
            error: emailError,
            message: emailError?.message,
            response: emailError?.response?.data
          });
        }
      } else {
        console.warn('⚠️ No user email found, skipping confirmation email');
      }

      console.log('🎉 Showing success alert...');
      // Show success popup
      Alert.alert(
        'Support Request Submitted',
        `Your support request has been submitted successfully!\n\nTicket ID: ${result.data.supportId}\n\nYou will receive an email confirmation shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('✅ User acknowledged success, resetting form and navigating back');
              reset();
              back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Support request submission failed:');
      console.error('🔍 Error details:', error);
      console.error('📱 Error message:', error?.message);
      console.error('🌐 Response data:', error?.response?.data);
      console.error('📊 Response status:', error?.response?.status);
      console.error('🔧 Request config:', error?.config);
      
      Alert.alert(
        'Error',
        'Failed to submit your support request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      console.log('🏁 Submission process complete, setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  return (
    <Container.Page
      showHeader
      headerTitle="Contact Support"
      backPress={() => back()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container.Box>
          <View className="mb-6">
            <Text className="text-lg font-medium text-gray-900 dark:text-gray-100">
              How can we help you?
            </Text>
            <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please provide details about your issue and we'll get back to you as soon as possible.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
              Category <Text className="text-red-500">*</Text>
            </Text>
            <ControlledSelect
              control={control}
              name="category"
              placeholder="Select a category"
              options={supportCategories}
            />
            {errors.category && (
              <View className="mt-1 flex-row items-center">
                <AntDesign name="exclamationcircle" size={12} color="#E84343" />
                <Text className="ml-1 text-sm text-red-500">
                  {errors.category.message}
                </Text>
              </View>
            )}
          </View>

          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                Description <Text className="text-red-500">*</Text>
              </Text>
              <Text 
                className={`text-sm ${
                  characterCount > maxCharacters ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {characterCount}/{maxCharacters}
              </Text>
            </View>
            <ControlledInput
              control={control}
              name="description"
              placeholder="Please describe your issue in detail..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{ height: 120 }}
              maxLength={maxCharacters}
            />
            {errors.description && (
              <View className="mt-1 flex-row items-center">
                <AntDesign name="exclamationcircle" size={12} color="#E84343" />
                <Text className="ml-1 text-sm text-red-500">
                  {errors.description.message}
                </Text>
              </View>
            )}
          </View>

          <View className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <View className="flex-row items-start">
              <AntDesign 
                name="infocirlce" 
                size={16} 
                color="#3B82F6" 
                style={{ marginTop: 2 }}
              />
              <View className="ml-2 flex-1">
                <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  What happens next?
                </Text>
                <Text className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  • You'll receive an email confirmation with your ticket ID
                  • Our support team will review your request
                  • You'll get updates via email as we work on your issue
                  • Check your support requests in Account → Support & Help
                </Text>
              </View>
            </View>
          </View>

          <CustomButton
            label="Submit"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            containerClassname="mb-5"
          />
        </Container.Box>
      </ScrollView>
    </Container.Page>
  );
}
