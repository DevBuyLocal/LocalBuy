import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';

/* FAQ DATA - FREQUENTLY ASKED QUESTIONS AND ANSWERS */
const faqData = [
  {
    id: 1,
    question: 'How do I place an order?',
    answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards and mobile money.',
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit and debit cards, mobile money payments, and bank transfers. All payments are processed securely through our encrypted payment system.',
  },
  {
    id: 3,
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 1-3 business days within the city and 3-7 business days for other locations. You can track your order status in the "Manage Orders" section.',
  },
  {
    id: 4,
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 30 minutes of placing it. After that, please contact our support team for assistance. Go to "Manage Orders" to view your order details.',
  },
  {
    id: 5,
    question: 'How do I track my order?',
    answer: 'You can track your order by going to the "Manage Orders" section in your account. You will receive real-time updates about your order status and delivery progress.',
  },
  {
    id: 6,
    question: 'What if I receive a damaged or wrong item?',
    answer: 'If you receive a damaged or incorrect item, please contact our support team immediately. We offer free returns and exchanges for such cases. Take photos of the item for faster resolution.',
  },
  {
    id: 7,
    question: 'How do I update my account information?',
    answer: 'Go to "Account Information" in your profile to update your personal details, contact information, and delivery addresses. Changes are saved automatically.',
  },
  {
    id: 8,
    question: 'How does the referral program work?',
    answer: 'Invite friends using your unique referral code found in the "Referrals" section. Both you and your friend will receive rewards when they make their first purchase.',
  },
  {
    id: 9,
    question: 'Are there delivery charges?',
    answer: 'Delivery charges vary based on your location and order value. Orders above a certain amount may qualify for free delivery. Check the delivery fee at checkout.',
  },
  {
    id: 10,
    question: 'How do I save items for later?',
    answer: 'You can save items to your wishlist by tapping the heart icon on any product. Access your saved items from the home screen or product pages.',
  },
  {
    id: 11,
    question: 'What if the app is not working properly?',
    answer: 'Try closing and reopening the app first. If issues persist, check your internet connection, update the app to the latest version, or restart your device. Contact support if problems continue.',
  },
  {
    id: 12,
    question: 'How do I change my password?',
    answer: 'Go to "Preference and Settings" in your account, then select "Change Password". You will need to enter your current password and create a new one.',
  },
];

/* FAQ ITEM COMPONENT - INDIVIDUAL COLLAPSIBLE FAQ ITEM */
interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps) {
  return (
    <View className="mb-3 rounded-lg border border-gray-200 bg-white">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="flex-1 pr-3 text-base font-medium text-gray-800">
          {question}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View className="border-t border-gray-100 px-4 pb-4 pt-3">
          <Text className="text-gray-600 leading-6">
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
}

/* FAQ COMPONENT - MAIN FAQ PAGE WITH ALL QUESTIONS */
function FAQ() {
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);

  const toggleItem = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Container.Page showHeader headerTitle="Frequently Asked Questions">
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          <Text className="mb-6 text-center text-gray-600">
            Find answers to common questions about using LocalBuy
          </Text>
          
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedItems.includes(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
          
          <View className="mt-6 rounded-lg bg-blue-50 p-4">
            <Text className="mb-2 font-medium text-blue-800">
              Still need help?
            </Text>
            <Text className="text-blue-700">
              If you couldn't find the answer you're looking for, please contact our support team through the "Contact support" option.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container.Page>
  );
}

export default FAQ; 