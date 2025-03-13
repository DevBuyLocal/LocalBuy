import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useGetUser } from '@/api';
import { useInitializePayment } from '@/api/order/use-initialize-payment';
import { useVerifyPayment } from '@/api/order/use-verify-payment';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { colors, SafeAreaView, ScrollView, Text, View } from '@/components/ui';
import { useLoader } from '@/lib/hooks/general/use-loader';

// eslint-disable-next-line max-lines-per-function
function Checkout() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [checkoutUri, setCheckoutUri] = React.useState('');
  const { push, replace } = useRouter();
  const { data: user } = useGetUser();
  const { setError, loading, setLoading, setSuccess } = useLoader({
    showLoadingPage: true,
  });

  const webViewRef = React.useRef<WebView>(null);

  const {
    orderId,
    price,
    scheduledDate,
  }: { orderId: string; price: string; scheduledDate: string } =
    useLocalSearchParams();

  const { mutate, isPending } = useInitializePayment({
    onSuccess: (data: any) => {
      setCheckoutUri(data.authorizationUrl);
      setShowModal(true);
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { mutate: verifyMutate, isPending: verifyIsPending } = useVerifyPayment(
    {
      onSuccess: () => {
        setSuccess('Payment successful');
        replace(`/order-success?orderId=${orderId}`);
      },
      onError: (error) => {
        setError(error?.response?.data);
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );

  const handlePayment = () => {
    setLoading(true);
    mutate({
      orderId: Number(orderId),
      email: user?.email || '',
      amount: Number(price),
    });
  };

  const handleNavigationStateChange = React.useCallback(
    (state: WebViewNavigation) => {
      if (state.url === 'https://standard.paystack.co/close') {
        setShowModal(false);
      }
    },
    []
  );

  const handleError = React.useCallback(
    (error: any) => {
      setShowModal(false);
      setError(error);
    },
    [setError]
  );

  const handleMessageReceived = React.useCallback(
    (data: string) => {
      const webResponse = JSON.parse(data);

      switch (webResponse.event) {
        case 'close':
          setShowModal(false);
          break;
        case 'success':
          verifyMutate({ reference: webResponse.data.reference });
          setShowModal(false);
          break;
        case 'error':
          setError(
            webResponse.data.message || 'An error occurred during payment.'
          );
          setShowModal(false);
          break;
        default:
          // setShowModal(false);
          break;
      }
    },
    [setError, verifyMutate]
  );

  return (
    <Container.Page showHeader headerTitle="Checkout">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-1"
      >
        <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
          <Text className="my-5 text-[16px] font-medium">Shipping address</Text>
          <View className="rounded-lg bg-white p-5">
            <Text className="mb-2 text-[16px] font-semibold">
              {user?.profile?.fullName ||
                user?.businessProfile?.name ||
                user?.email}
            </Text>
            <Text className="w-[90%] text-[16px] opacity-75">
              {user?.type === 'individual'
                ? user?.profile?.address
                : user?.profile?.businessAddress}
            </Text>

            <Text className="mt-5 text-[16px] opacity-85">
              +234{' '}
              {user?.type === 'individual'
                ? user?.profile?.deliveryPhone
                : user?.profile?.businessPhone}
            </Text>
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

          <View className="absolute bottom-12 w-full self-center">
            <CustomButton
              label="Continue"
              // onPress={() => {
              //   replace('/order-success');
              // }}
              onPress={handlePayment}
              loading={loading || isPending || verifyIsPending}
              disabled={loading || isPending || verifyIsPending}
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

      <Modal
        style={{ flex: 1 }}
        visible={showModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView className="flex-1 p-5" edges={['top']}>
          <WebView
            source={{ uri: checkoutUri }}
            onMessage={(e) => {
              handleMessageReceived(e.nativeEvent.data);
            }}
            onError={handleError}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            ref={webViewRef}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled={true}
            startInLoadingState={true}
            style={{ backgroundColor: 'transparent' }}
            injectedJavaScript={`
              window.addEventListener('message', function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify(e.data));
              });
              true;
            `}
          />
          {isLoading && (
            <View className="items-center justify-center">
              <ActivityIndicator size="large" color={colors.primaryText} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </Container.Page>
  );
}

export default Checkout;
