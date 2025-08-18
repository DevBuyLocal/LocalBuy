import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import FeedbackPopup from '@/components/feedback/feedback-popup';
import { Image, Text } from '@/components/ui';
import { useAuth } from '@/lib';

export default function OrderSuccess() {
  const { replace } = useRouter();
  const { user } = useAuth();
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const { orderId }: { orderId: string } = useLocalSearchParams();

  // Show feedback popup after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 2000); // Show popup 2 seconds after order success

    return () => clearTimeout(timer);
  }, []);
  return (
    <Container.Page>
      <Container.Box containerClassName="items-center h-full mt-40">
        <Image
          source={require('../../../assets/images/success.png')}
          className="size-[120px]"
        />
        <Text className="my-4 mt-5 text-[20px] font-semibold">
          Your order has been placed
        </Text>
        <Text className="mt-3 opacity-60">Order number: #{orderId}</Text>
        <Text className="mt-3 w-[90%] text-center text-[14px] font-thin">
          You will receive text updates to{' '}
          {user?.phoneNumber || user?.profile?.deliveryPhone || user?.defaultAddress?.phoneNumber || 'your registered phone number'} you can change your
          number at anytime
        </Text>
      </Container.Box>
      <Container.Box containerClassName="absolute bottom-14 w-full">
        <CustomButton
          label="View Order Details"
          onPress={() => replace(`/track-order?orderId=${orderId}`)}
        />

        <Text
          className="self-center p-5"
          onPress={() => replace('/all-products')}
        >
          Continue shopping
        </Text>
      </Container.Box>

      {/* Feedback Popup */}
      <FeedbackPopup
        visible={showFeedbackPopup}
        onClose={() => setShowFeedbackPopup(false)}
        orderNumber={orderId}
      />
    </Container.Page>
  );
}
