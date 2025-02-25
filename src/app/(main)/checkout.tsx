import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Paystack, type paystackProps } from 'react-native-paystack-webview';

import { useInitializePayment } from '@/api/order/use-initialize-payment';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { colors, ScrollView, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { Env } from '@/lib/env';
import { useLoader } from '@/lib/hooks/general/use-loader';

function Checkout() {
  const paystackWebViewRef = React.useRef<paystackProps.PayStackRef>(null);
  const { user } = useAuth();
  const { push } = useRouter();
  const { setError, loading, setLoading } = useLoader({
    showLoadingPage: true,
  });

  const {
    orderId,
    price,
    scheduledDate,
  }: { orderId: string; price: string; scheduledDate: string } =
    useLocalSearchParams();

  const { mutate, isPending } = useInitializePayment({
    onSuccess: (data) => {
      console.log('🚀 ~ Checkout ~ data:', data);
      paystackWebViewRef.current?.startTransaction();
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handlePayment = () => {
    setLoading(true);
    mutate({
      orderId: Number(orderId),
      email: user?.email || '',
      amount: Number(price),
    });
  };

  return (
    <Container.Page showHeader headerTitle="Checkout">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-1"
      >
        <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
          <Text className="my-5 text-[16px] font-medium">Shipping address</Text>
          <View className="rounded-lg bg-white p-5">
            <Text className="w-[90%] text-[16px] opacity-75">
              64 Ilogbo Road, Furniture Bus Stop, Ajangbadi, Ojo, Lagos. Imam
              Raji Central.
            </Text>

            <Text className="mt-5 text-[16px] opacity-85">+2340000000000</Text>
          </View>

          {/* ================================= */}
          <Text className="mt-8 text-[16px] font-medium">Order summary</Text>
          <View className="mt-4 rounded-lg bg-white p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] opacity-65">Subtotal</Text>
              <Text className="text-[16px] font-medium">
                N{Number(price)?.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-5">
              <Text className="text-[16px] opacity-65">VAT</Text>
              <Text className="text-[16px] font-medium">N0.00</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] opacity-65">Discount</Text>
              <Text className="text-[16px] font-medium">N0.00</Text>
            </View>
          </View>
          {/* ================================= */}
          {/* <Text className="my-5 text-[16px] font-medium">Payment</Text>
          <View className="rounded-lg bg-white p-5">
            <Text className="w-[90%] text-[16px] opacity-75">Payment</Text>
          </View> */}
          <View className="absolute bottom-12 w-full self-center">
            <CustomButton
              label="Continue"
              onPress={handlePayment}
              loading={loading || isPending}
              disabled={loading || isPending}
            />
            {scheduledDate !== null && (
              <CustomButton.Secondary
                label={'Schedule order'}
                onPress={() =>
                  push(`/schedule-order?orderId=${orderId}&price=${price}`)
                }
              />
            )}
          </View>
        </Container.Box>
      </ScrollView>

      <Paystack
        paystackKey={Env.PAYSTACK_PUBLIC_KEY}
        billingEmail={user?.email || ''}
        amount={price}
        activityIndicatorColor={colors.primaryText}
        onCancel={(e) => {
          console.log('🚀 ~ Checkout ~ e:', e);
          // handle response here
        }}
        onSuccess={(res) => {
          console.log('🚀 ~ Checkout ~ res:', res);
          // handle response here
        }}
        ref={paystackWebViewRef as any}
      />
    </Container.Page>
  );
}

export default Checkout;
