import React from 'react';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { Text, View } from '@/components/ui';
import { CartSelector, useCart } from '@/lib/cart';

function Checkout() {
  const { totalPrice } = useCart(CartSelector);
  return (
    <Container.Page showHeader headerTitle="Checkout">
      <Container.Box containerClassName="bg-[#F7F7F7] flex-1">
        <Text className="my-5 text-[16px] font-medium">Shipping address</Text>
        <View className="rounded-lg bg-white p-5">
          <Text className="w-[90%] text-[16px] opacity-75">
            64 Ilogbo Road, Furniture Bus Stop, Ajangbadi, Ojo, Lagos. Imam Raji
            Central.
          </Text>

          <Text className="mt-5 text-[16px] opacity-85">+23489382938</Text>
        </View>

        {/* ================================= */}
        <Text className="mt-8 text-[16px] font-medium">Order summary</Text>
        <View className="mt-4 rounded-lg bg-white p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-[16px] opacity-65">Subtotal</Text>
            <Text className="text-[16px] font-medium">
              N{totalPrice?.toLocaleString()}
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
        <Text className="my-5 text-[16px] font-medium">Payment</Text>
        <View className="rounded-lg bg-white p-5">
          <Text className="w-[90%] text-[16px] opacity-75">Payment</Text>
        </View>
        <View className="absolute bottom-12 w-full self-center">
          <CustomButton label="Continue" />
        </View>
      </Container.Box>
    </Container.Page>
  );
}

export default Checkout;
