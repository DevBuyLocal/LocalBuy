import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { Text, View } from '@/components/ui';

export default function FeedbackThankYou() {
  const { back, push } = useRouter();
  const { feedbackId, type } = useLocalSearchParams<{ 
    feedbackId: string; 
    type: string;
  }>();

  const getFeedbackTypeIcon = (feedbackType: string) => {
    switch (feedbackType) {
      case 'Rating':
        return <AntDesign name="star" size={64} color="#EC9F01" />;
      case 'Comment':
        return <MaterialIcons name="comment" size={64} color="#3B82F6" />;
      case 'Suggestion':
        return <MaterialIcons name="lightbulb-outline" size={64} color="#10B981" />;
      case 'Complaint':
        return <MaterialIcons name="report-problem" size={64} color="#F59E0B" />;
      default:
        return <MaterialIcons name="feedback" size={64} color="#6B7280" />;
    }
  };

  const getFeedbackTypeMessage = (feedbackType: string) => {
    switch (feedbackType) {
      case 'Rating':
        return 'Thank you for rating your experience! Your review helps other customers and guides our improvements.';
      case 'Comment':
        return 'Thank you for sharing your thoughts! We value your input and will consider it for future enhancements.';
      case 'Suggestion':
        return 'Thank you for your suggestion! Our team will review it and consider implementing it to improve BuyLocal.';
      case 'Complaint':
        return 'Thank you for bringing this to our attention. We take all complaints seriously and will investigate the issue.';
      default:
        return 'Thank you for your feedback! We appreciate you taking the time to help us improve.';
    }
  };

  return (
    <Container.Page
      showHeader
      headerTitle="Feedback Submitted"
      backPress={() => back()}
    >
      <View className="flex-1 items-center justify-center px-6">
        {/* Success Icon */}
        <View className="mb-8 items-center">
          <View className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/20">
            <AntDesign name="checkcircle" size={64} color="#22C55E" />
          </View>
        </View>

        {/* Thank You Message */}
        <View className="mb-12 items-center">
          <Text className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Thank You!
          </Text>
          <Text className="text-center text-lg text-gray-700 dark:text-gray-300">
            Your feedback has been submitted successfully
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <CustomButton
            label="Submit Another Feedback"
            onPress={() => push('/submit-feedback')}
            containerClassname="w-full"
          />
          
          <CustomButton.Secondary
            label="Continue Shopping"
            onPress={() => push('/(tabs)/')}
            containerClassname="w-full"
          />
        </View>
      </View>
    </Container.Page>
  );
}
