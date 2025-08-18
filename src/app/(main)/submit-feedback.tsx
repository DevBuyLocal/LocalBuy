import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView } from 'react-native';
import { z } from 'zod';

import { useSubmitFeedback, useGetUser } from '@/api';
import StarRating from '@/components/feedback/star-rating';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { ControlledInput, ControlledSelect, Text, View } from '@/components/ui';
import type { OptionType } from '@/components/ui';

const feedbackTypes: OptionType[] = [
  { value: 'Rating', label: 'Rating & Review' },
  { value: 'Comment', label: 'General Comment' },
  { value: 'Suggestion', label: 'Suggestion for Improvement' },
  { value: 'Complaint', label: 'Complaint or Issue' },
];

const schema = z.object({
  type: z.enum(['Rating', 'Comment', 'Suggestion', 'Complaint'], {
    required_error: 'Please select a feedback type',
  }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
  rating: z.number().min(1).max(5).optional(),
}).refine((data) => {
  // Rating is required when type is 'Rating'
  if (data.type === 'Rating' && !data.rating) {
    return false;
  }
  return true;
}, {
  message: 'Rating is required for rating feedback',
  path: ['rating'],
});

type FormData = z.infer<typeof schema>;

export default function SubmitFeedback() {
  const { back, push } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const submitFeedback = useSubmitFeedback();
  const { data: userData } = useGetUser();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined,
      message: '',
      rating: undefined,
    },
  });

  const selectedType = watch('type');
  const message = watch('message');
  const characterCount = message?.length || 0;
  const maxCharacters = 1000;

  // Update form when star rating changes
  const handleStarRatingChange = (rating: number) => {
    setStarRating(rating);
    setValue('rating', rating);
  };

  const onSubmit = async (data: FormData) => {
    console.log('🚀 Starting feedback submission...');
    console.log('📝 Form data:', {
      type: data.type,
      message: data.message,
      rating: data.rating,
      messageLength: data.message?.length
    });
    console.log('👤 User data:', {
      email: userData?.email,
      fullName: userData?.fullName,
      hasUserData: !!userData
    });

    try {
      setIsSubmitting(true);
      console.log('📤 Submitting feedback to API...');
      
      const requestData: any = {
        type: data.type,
        message: data.message,
      };

      // Add rating only if type is Rating
      if (data.type === 'Rating' && data.rating) {
        requestData.rating = data.rating;
      }

      const result = await submitFeedback.mutateAsync(requestData);

      console.log('✅ Feedback submitted successfully:', {
        feedbackId: result.data.feedbackId,
        requestId: result.data.id,
        type: result.data.type,
        result: result
      });

      console.log('🎉 Navigating to thank you screen...');
      // Navigate to thank you screen with feedback reference
      push(`/feedback-thank-you?feedbackId=${result.data.feedbackId}&type=${data.type}`);
      
    } catch (error) {
      console.error('❌ Feedback submission failed:');
      console.error('🔍 Error details:', error);
      console.error('📱 Error message:', error?.message);
      console.error('🌐 Response data:', error?.response?.data);
      console.error('📊 Response status:', error?.response?.status);
      console.error('🔧 Request config:', error?.config);
      
      Alert.alert(
        'Error',
        'Failed to submit your feedback. Please try again.',
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
      headerTitle="Submit Feedback"
      backPress={() => back()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container.Box>
          <View className="mb-6">
            <Text className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Share Your Experience
            </Text>
            <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Help us improve BuyLocal by sharing your thoughts, suggestions, or concerns.
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
              Feedback Type <Text className="text-red-500">*</Text>
            </Text>
            <ControlledSelect
              control={control}
              name="type"
              placeholder="Select feedback type"
              options={feedbackTypes}
            />
            {errors.type && (
              <View className="mt-1 flex-row items-center">
                <AntDesign name="exclamationcircle" size={12} color="#E84343" />
                <Text className="ml-1 text-sm text-red-500">
                  {errors.type.message}
                </Text>
              </View>
            )}
          </View>

          {selectedType === 'Rating' && (
            <View className="mb-6">
              <Text className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
                Rating <Text className="text-red-500">*</Text>
              </Text>
              <View className="mb-2">
                <StarRating
                  rating={starRating}
                  onRatingChange={handleStarRatingChange}
                  size={40}
                />
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {starRating === 0 && 'Tap to rate your experience'}
                {starRating === 1 && '⭐ Poor'}
                {starRating === 2 && '⭐⭐ Fair'}
                {starRating === 3 && '⭐⭐⭐ Good'}
                {starRating === 4 && '⭐⭐⭐⭐ Very Good'}
                {starRating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </Text>
              {errors.rating && (
                <View className="mt-1 flex-row items-center">
                  <AntDesign name="exclamationcircle" size={12} color="#E84343" />
                  <Text className="ml-1 text-sm text-red-500">
                    {errors.rating.message}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                Message <Text className="text-red-500">*</Text>
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
              name="message"
              placeholder={
                selectedType === 'Rating' 
                  ? 'Tell us about your experience (optional for ratings)...'
                  : selectedType === 'Suggestion'
                  ? 'What improvements would you like to see?'
                  : selectedType === 'Complaint'
                  ? 'Please describe the issue you encountered...'
                  : 'Share your thoughts with us...'
              }
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{ height: 120 }}
              maxLength={maxCharacters}
            />
            {errors.message && (
              <View className="mt-1 flex-row items-center">
                <AntDesign name="exclamationcircle" size={12} color="#E84343" />
                <Text className="ml-1 text-sm text-red-500">
                  {errors.message.message}
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
                  Your Feedback Matters
                </Text>
                <Text className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  • All feedback is reviewed by our team
                  • You'll receive a reference number for tracking
                  • We may follow up for additional details
                  • Your input helps us improve BuyLocal for everyone
                </Text>
              </View>
            </View>
          </View>

          <CustomButton
            label="Submit Feedback"
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
