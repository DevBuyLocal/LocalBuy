import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal } from 'react-native';

import CustomButton from '@/components/general/custom-button';
import { Pressable, Text, View } from '@/components/ui';

interface FeedbackPopupProps {
  visible: boolean;
  onClose: () => void;
  orderNumber?: string;
}

export default function FeedbackPopup({ 
  visible, 
  onClose, 
  orderNumber 
}: FeedbackPopupProps) {
  const { push } = useRouter();

  const handleSubmitFeedback = () => {
    onClose();
    push('/submit-feedback');
  };

  const handleMaybeLater = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-lg bg-white p-6 dark:bg-gray-800">
          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="absolute right-4 top-4 z-10"
          >
            <AntDesign name="close" size={20} color="#6B7280" />
          </Pressable>

          {/* Header */}
          <View className="mb-6 items-center">
            <View className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <MaterialIcons name="check-circle" size={32} color="#22C55E" />
            </View>
            <Text className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
              Order Completed!
            </Text>
            {orderNumber && (
              <Text className="text-center text-sm text-gray-600 dark:text-gray-400">
                Order #{orderNumber}
              </Text>
            )}
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="mb-4 text-center text-base text-gray-700 dark:text-gray-300">
              How was your experience with BuyLocal?
            </Text>
            <Text className="text-center text-sm text-gray-600 dark:text-gray-400">
              Your feedback helps us improve our service and helps other customers make better decisions.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <CustomButton
              label="Share Feedback"
              onPress={handleSubmitFeedback}
              containerClassname="w-full"
            />
            
            <CustomButton.Secondary
              label="Maybe Later"
              onPress={handleMaybeLater}
              containerClassname="w-full"
            />
          </View>

          {/* Footer */}
          <View className="mt-4 flex-row items-center justify-center">
            <MaterialIcons name="feedback" size={16} color="#EC9F01" />
            <Text className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              Takes less than 2 minutes
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
